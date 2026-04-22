import { DATA } from "@/lib/dashboard-data"

export const DATE_OPTIONS = ["Today", "Last 7 days", "Last 30 days", "Last 90 days", "This Quarter", "YTD", "Custom"] as const
export const ROLE_OPTIONS = [
  "All Roles", "Sea Import", "Sea Export", "Sea Crosstrade",
  "Air Import", "Air Export", "Air Crosstrade",
  "Road Import", "Road Export", "Clearance Agent",
] as const

export type DateRange = typeof DATE_OPTIONS[number]
export type ServiceRole = typeof ROLE_OPTIONS[number]
export type DashboardData = typeof DATA
export type InteractiveModeKey = "sea" | "air" | "road"
export type InteractionType = "mode" | "status" | "customer"

export interface InteractionSelection {
  type: InteractionType
  value: string
  label: string
}

const BASE_CONVERSION_RATE = DATA.overview.wonEnquiries / DATA.overview.totalEnquiries
const BASE_POD_RATE = DATA.overview.podCompleted / DATA.overview.activeJobs

function roundNumber(value: number, min = 0) {
  return Math.max(min, Math.round(value))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function modeKeyFromLabel(mode: string): InteractiveModeKey {
  const normalized = mode.toLowerCase()
  if (normalized.includes("air")) return "air"
  if (normalized.includes("road")) return "road"
  return "sea"
}

const DATE_SCALE: Record<DateRange, number> = {
  "Today": 0.08,
  "Last 7 days": 0.28,
  "Last 30 days": 1,
  "Last 90 days": 1.9,
  "This Quarter": 2.6,
  "YTD": 4.2,
  "Custom": 1.15,
}

const ROLE_MODE_SCALE: Record<ServiceRole, { sea: number; air: number; road: number; clearanceBoost: number }> = {
  "All Roles": { sea: 1, air: 1, road: 1, clearanceBoost: 1 },
  "Sea Import": { sea: 1.35, air: 0.45, road: 0.45, clearanceBoost: 1 },
  "Sea Export": { sea: 1.3, air: 0.45, road: 0.45, clearanceBoost: 1 },
  "Sea Crosstrade": { sea: 1.2, air: 0.55, road: 0.45, clearanceBoost: 1 },
  "Air Import": { sea: 0.5, air: 1.35, road: 0.5, clearanceBoost: 1 },
  "Air Export": { sea: 0.5, air: 1.3, road: 0.5, clearanceBoost: 1 },
  "Air Crosstrade": { sea: 0.55, air: 1.2, road: 0.5, clearanceBoost: 1 },
  "Road Import": { sea: 0.5, air: 0.5, road: 1.35, clearanceBoost: 1 },
  "Road Export": { sea: 0.5, air: 0.5, road: 1.3, clearanceBoost: 1 },
  "Clearance Agent": { sea: 0.75, air: 0.75, road: 0.95, clearanceBoost: 1.35 },
}

function scaleModeBreakdown(dateRange: DateRange, role: ServiceRole) {
  const dateFactor = DATE_SCALE[dateRange]
  const roleScale = ROLE_MODE_SCALE[role]

  return DATA.modeBreakdown.map((row) => {
    const modeKey = row.mode.toLowerCase() as "sea" | "air" | "road"
    const factor = dateFactor * roleScale[modeKey]
    return {
      mode: row.mode,
      enquiries: roundNumber(row.enquiries * factor, 1),
      jobs: roundNumber(row.jobs * factor * 0.98, 1),
    }
  })
}

function scaleDirectional(
  rows: { direction: string; count: number }[],
  totalTarget: number,
  clearanceBoost: number,
) {
  const totalBase = rows.reduce((sum, row) => sum + row.count, 0) || 1
  const weighted = rows.map((row) => {
    const ratio = row.count / totalBase
    const boost = row.direction.toLowerCase().includes("clearance") ? clearanceBoost : 1
    return { direction: row.direction, weighted: ratio * boost }
  })
  const weightedTotal = weighted.reduce((sum, row) => sum + row.weighted, 0) || 1
  return weighted.map((row) => ({
    direction: row.direction,
    count: roundNumber((row.weighted / weightedTotal) * totalTarget, 0),
  }))
}

export function buildFilteredData(
  dateRange: DateRange,
  role: ServiceRole,
  selections: InteractionSelection[] = [],
): DashboardData {
  let modeBreakdown = scaleModeBreakdown(dateRange, role)
  const roleScale = ROLE_MODE_SCALE[role]

  const selectedMode = selections.find((s) => s.type === "mode")?.value as InteractiveModeKey | undefined
  const selectedStatus = selections.find((s) => s.type === "status")?.value
  const selectedCustomer = selections.find((s) => s.type === "customer")?.value

  if (selectedMode) {
    modeBreakdown = modeBreakdown.map((row) => {
      const modeKey = row.mode.toLowerCase() as InteractiveModeKey
      const factor = modeKey === selectedMode ? 1.35 : 0.38
      return {
        ...row,
        enquiries: roundNumber(row.enquiries * factor, 1),
        jobs: roundNumber(row.jobs * factor, 1),
      }
    })
  }

  let totalEnquiries = modeBreakdown.reduce((sum, row) => sum + row.enquiries, 0)
  let activeJobs = modeBreakdown.reduce((sum, row) => sum + row.jobs, 0)
  const conversionRate = clamp(BASE_CONVERSION_RATE + (role === "All Roles" ? 0 : 0.01), 0.04, 0.22)
  let wonEnquiries = roundNumber(totalEnquiries * conversionRate, 1)
  let podCompleted = roundNumber(activeJobs * BASE_POD_RATE, 0)

  const seaJobs = modeBreakdown.find((row) => row.mode === "Sea")?.jobs ?? 0
  const airJobs = modeBreakdown.find((row) => row.mode === "Air")?.jobs ?? 0
  const roadJobsMode = modeBreakdown.find((row) => row.mode === "Road")?.jobs ?? 0

  const fclContainers = roundNumber(seaJobs * (DATA.overview.fclContainers / DATA.modeBreakdown[0].jobs), 1)
  const totalUnits = roundNumber(fclContainers * (DATA.overview.totalUnits / DATA.overview.fclContainers), 1)

  let enquiryStatus = DATA.enquiryStatus.map((row) => {
    const baseTotal = DATA.enquiryStatus.reduce((sum, x) => sum + x.value, 0)
    const ratio = row.value / baseTotal
    return { ...row, value: roundNumber(totalEnquiries * ratio, 0) }
  })

  if (selectedStatus) {
    const selectedShare = 0.68
    const otherShare = 1 - selectedShare
    const selectedName = selectedStatus.toLowerCase()
    const selectedEntry = enquiryStatus.find((row) => row.name.toLowerCase() === selectedName)
    const others = enquiryStatus.filter((row) => row.name.toLowerCase() !== selectedName)
    const othersTotal = others.reduce((sum, row) => sum + row.value, 0) || 1
    enquiryStatus = enquiryStatus.map((row) => {
      if (row.name.toLowerCase() === selectedName && selectedEntry) {
        return { ...row, value: roundNumber(totalEnquiries * selectedShare, 0) }
      }
      return { ...row, value: roundNumber(totalEnquiries * otherShare * (row.value / othersTotal), 0) }
    })
  }

  const subEnquirySea = scaleDirectional(DATA.subEnquirySea, modeBreakdown[0].enquiries, roleScale.clearanceBoost)
  const subEnquiryAir = scaleDirectional(DATA.subEnquiryAir, modeBreakdown[1].enquiries, roleScale.clearanceBoost)
  const subEnquiryRoad = scaleDirectional(DATA.subEnquiryRoad, modeBreakdown[2].enquiries, roleScale.clearanceBoost)

  let jobBreakdown = DATA.jobBreakdown.map((row) => {
    const modeFactor = row.mode === "sea" ? roleScale.sea : row.mode === "air" ? roleScale.air : roleScale.road
    const dateFactor = DATE_SCALE[dateRange]
    const clearanceBoost = row.label.toLowerCase().includes("clearance") ? roleScale.clearanceBoost : 1
    const selectedModeBoost = selectedMode ? (row.mode === selectedMode ? 1.3 : 0.45) : 1
    return {
      ...row,
      value: roundNumber(row.value * dateFactor * modeFactor * clearanceBoost * selectedModeBoost, 0),
    }
  })

  if (selectedStatus?.toLowerCase() === "won") {
    jobBreakdown = jobBreakdown.map((row) => ({ ...row, value: roundNumber(row.value * 1.22, 0) }))
  }
  if (selectedStatus && !["won", "new"].includes(selectedStatus.toLowerCase())) {
    jobBreakdown = jobBreakdown.map((row) => ({ ...row, value: roundNumber(row.value * 0.74, 0) }))
  }

  const funnel = [
    { ...DATA.funnel[0], value: totalEnquiries },
    { ...DATA.funnel[1], value: wonEnquiries },
    { ...DATA.funnel[2], value: activeJobs },
  ]

  const containers = DATA.containers.map((row) => {
    const scale = (seaJobs || 1) / (DATA.modeBreakdown[0].jobs || 1)
    return {
      ...row,
      count: roundNumber(row.count * scale, 0),
      qty: roundNumber(row.qty * scale, 0),
    }
  })

  let customersByEnquiry = DATA.customersByEnquiry.map((row) => ({
    ...row,
    count: roundNumber(row.count * DATE_SCALE[dateRange] * (role === "All Roles" ? 1 : 0.85), 1),
  }))

  let customersByJob = DATA.customersByJob.map((row) => ({
    ...row,
    count: roundNumber(row.count * DATE_SCALE[dateRange] * (role === "All Roles" ? 1 : 0.88), 1),
  }))

  if (selectedCustomer) {
    const selectedEnquiry = customersByEnquiry.find((row) => row.name === selectedCustomer)
      ?? customersByJob.find((row) => row.name === selectedCustomer)
    const topBase = Math.max(customersByEnquiry[0]?.count ?? 1, 1)
    const customerScale = clamp((selectedEnquiry?.count ?? topBase) / topBase, 0.5, 1.3)
    const globalScale = clamp(0.72 + customerScale * 0.48, 0.7, 1.35)

    modeBreakdown = modeBreakdown.map((row) => ({
      ...row,
      enquiries: roundNumber(row.enquiries * globalScale, 1),
      jobs: roundNumber(row.jobs * globalScale, 1),
    }))
    enquiryStatus = enquiryStatus.map((row) => ({ ...row, value: roundNumber(row.value * globalScale, 0) }))
    jobBreakdown = jobBreakdown.map((row) => ({ ...row, value: roundNumber(row.value * globalScale, 0) }))

    totalEnquiries = roundNumber(totalEnquiries * globalScale, 1)
    activeJobs = roundNumber(activeJobs * globalScale, 1)
    wonEnquiries = roundNumber(totalEnquiries * conversionRate, 1)
    podCompleted = roundNumber(activeJobs * BASE_POD_RATE, 0)

    customersByEnquiry = customersByEnquiry.map((row) => ({
      ...row,
      count: row.name === selectedCustomer ? roundNumber(row.count * 1.45, 1) : roundNumber(row.count * 0.62, 1),
    }))
    customersByJob = customersByJob.map((row) => ({
      ...row,
      count: row.name === selectedCustomer ? roundNumber(row.count * 1.4, 1) : roundNumber(row.count * 0.65, 1),
    }))
  }

  const maxRecent = clamp(Math.max(1, Math.ceil(podCompleted / 10)), 1, DATA.recentPODs.length)
  const recentPODs = DATA.recentPODs.slice(0, maxRecent)

  return {
    ...DATA,
    overview: {
      totalEnquiries,
      wonEnquiries,
      activeJobs,
      fclContainers,
      totalUnits,
      seaMBL: roundNumber(seaJobs * (DATA.overview.seaMBL / DATA.modeBreakdown[0].jobs), 0),
      airHAWB: roundNumber(airJobs * (DATA.overview.airHAWB / DATA.modeBreakdown[1].jobs), 0),
      roadJobs: roundNumber(roadJobsMode * (DATA.overview.roadJobs / DATA.modeBreakdown[2].jobs), 0),
      podCompleted,
    },
    enquiryStatus,
    modeBreakdown,
    subEnquirySea,
    subEnquiryAir,
    subEnquiryRoad,
    jobBreakdown,
    funnel,
    containers,
    customersByEnquiry,
    customersByJob,
    recentPODs,
  }
}

export function buildStepCounts(data: DashboardData) {
  const totalSubEnquiries = data.subEnquirySea.reduce((s, x) => s + x.count, 0)
    + data.subEnquiryAir.reduce((s, x) => s + x.count, 0)
    + data.subEnquiryRoad.reduce((s, x) => s + x.count, 0)

  return [
    data.overview.totalEnquiries,
    totalSubEnquiries,
    data.overview.activeJobs,
    roundNumber(data.overview.activeJobs * 0.935, 0),
    data.overview.podCompleted,
  ]
}

export function getSelectionFromMode(modeLabel: string): InteractionSelection {
  const modeKey = modeKeyFromLabel(modeLabel)
  return { type: "mode", value: modeKey, label: modeKey[0].toUpperCase() + modeKey.slice(1) }
}
