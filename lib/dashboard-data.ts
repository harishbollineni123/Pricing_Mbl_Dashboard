import { FileText, ClipboardList, Briefcase, Activity, CheckCircle2 } from "lucide-react"

export const DATA = {
  overview: {
    totalEnquiries: 1521,
    wonEnquiries: 145,
    activeJobs: 712,
    fclContainers: 1064,
    totalUnits: 8200,
    seaMBL: 405,
    airHAWB: 65,
    roadJobs: 13,
    podCompleted: 39,
  },
  enquiryStatus: [
    { name: "New", value: 1276, color: "#3b82f6" },
    { name: "Won", value: 145, color: "#16a34a" },
    { name: "Quoted", value: 96, color: "#a855f7" },
    { name: "Awaiting Rates", value: 4, color: "#f97316" },
  ],
  modeBreakdown: [
    { mode: "Sea", enquiries: 1110, jobs: 462 },
    { mode: "Air", enquiries: 306, jobs: 156 },
    { mode: "Road", enquiries: 104, jobs: 62 },
  ],
  subEnquirySea: [
    { direction: "Import", count: 612 },
    { direction: "Export", count: 398 },
    { direction: "Crosstrade", count: 100 },
  ],
  subEnquiryAir: [
    { direction: "Import", count: 168 },
    { direction: "Export", count: 102 },
    { direction: "Crosstrade", count: 36 },
  ],
  subEnquiryRoad: [
    { direction: "Import", count: 58 },
    { direction: "Export", count: 32 },
    { direction: "Clearance", count: 14 },
  ],
  jobBreakdown: [
    { label: "Sea Import", value: 251, mode: "sea" },
    { label: "Sea Export", value: 151, mode: "sea" },
    { label: "Air Import", value: 83, mode: "air" },
    { label: "Air Export", value: 48, mode: "air" },
    { label: "Sea Clearance", value: 36, mode: "sea" },
    { label: "Road Import", value: 33, mode: "road" },
    { label: "Air Crosstrade", value: 25, mode: "air" },
    { label: "Sea Crosstrade", value: 24, mode: "sea" },
    { label: "Road Export", value: 16, mode: "road" },
    { label: "Road Clearance", value: 13, mode: "road" },
  ],
  funnel: [
    { name: "Enquiries", value: 1521, fill: "#3b82f6" },
    { name: "Won", value: 145, fill: "#a855f7" },
    { name: "Jobs", value: 712, fill: "#16a34a" },
  ],
  containers: [
    { type: "20ft Std", count: 528, qty: 3280 },
    { type: "40ft Std", count: 167, qty: 3554 },
    { type: "40ft HC", count: 276, qty: 698 },
    { type: "20ft OT", count: 37, qty: 75 },
    { type: "45ft HC", count: 18, qty: 70 },
    { type: "40ft RF", count: 12, qty: 23 },
  ],
  customersByEnquiry: [
    { name: "Arteco Ceramics LLC", count: 44, initials: "AC" },
    { name: "Ghassan Ahmed Al Sulaiman", count: 31, initials: "GA" },
    { name: "Final Specs Flooring", count: 25, initials: "FS" },
    { name: "VOLTUSWAVE ORGANIZATION", count: 23, initials: "VO" },
  ],
  customersByJob: [
    { name: "Al Faiq Readymade Garments", count: 11, initials: "AF" },
    { name: "Arteco Ceramics LLC", count: 11, initials: "AC" },
    { name: "Sun & Sand Sports", count: 10, initials: "SS" },
  ],
  sparkline: [
    { d: 1, v: 42 }, { d: 2, v: 58 }, { d: 3, v: 51 },
    { d: 4, v: 72 }, { d: 5, v: 65 }, { d: 6, v: 84 },
    { d: 7, v: 79 }, { d: 8, v: 96 }, { d: 9, v: 88 }, { d: 10, v: 112 },
  ],
  recentPODs: [
    { id: "POD-2891", customer: "Arteco Ceramics", mode: "sea", location: "Jebel Ali", time: "2h ago", status: "Delivered" },
    { id: "POD-2890", customer: "Sun & Sand Sports", mode: "air", location: "DXB Cargo", time: "5h ago", status: "Delivered" },
    { id: "POD-2889", customer: "Al Faiq Garments", mode: "sea", location: "Mundra Port", time: "Yesterday", status: "Delivered" },
    { id: "POD-2888", customer: "Final Specs", mode: "road", location: "Riyadh DC", time: "Yesterday", status: "Delivered" },
    { id: "POD-2887", customer: "Ghassan Ahmed", mode: "sea", location: "Dammam", time: "2d ago", status: "Delivered" },
  ],
}

export const STEPS_CONFIG = [
  { id: 0, label: "Enquiry", count: 1521, icon: FileText },
  { id: 1, label: "Sub-Enquiry", count: 1520, icon: ClipboardList },
  { id: 2, label: "Jobs", count: 712, icon: Briefcase },
  { id: 3, label: "Operations", count: 666, icon: Activity },
  { id: 4, label: "POD", count: 39, icon: CheckCircle2 },
]
