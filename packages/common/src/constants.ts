export const API_ROUTES = {
    LOGIN: "/api/login",
    REQUEST: "/api/request",
    DIRECTORY: "/api/directory",
    EXPORTCSV: "/api/export",
    SERVICE: "/api/serviceRequest",
    IMPORT: "/api/importcsv",
    MAPS: "/api/maps",
    EMPLOYEE: "/api/employee",
    DOCTOR: "/api/doctors",
    CENTER: "/api/center",
    CHAT: "/api/chat",
};

export const CENTERS = [
    {
        value: "TwentyPatriotPlace",
        label: "20 Patriot Place",
    },
    {
        value: "TwentyTwoPatriotPlace",
        label: "22 Patriot Place",
    },
    {
        value: "ChestnutHill",
        label: "Chestnut Hill",
    },
    {
        value: "Faulkner",
        label: "Faulkner",
    },
    {
        value: "BWH",
        label: "Brigham & Women's",
    },
];

export const PP20_LOCATIONS = [
    {
        value: "12",
        label: "Blood Draw/Phlebotomy",
    },
    {
        value: "48",
        label: "Bridge",
    },
    {
        value: "15",
        label: "Cardiovascular Services",
    },
    {
        value: "47",
        label: "Citra Cafe",
    },
    {
        value: "45",
        label: "Clinical Lab",
    },
    {
        value: "7",
        label: "Day Surgery Center",
    },
    {
        value: "2",
        label: "Electromyography (EMG)",
    },
    {
        value: "44",
        label: "Information Desk",
    },
    {
        value: "3",
        label: "Nutrition",
    },
    {
        value: "10",
        label: "Orthopedics",
    },
    {
        value: "4",
        label: "Pain Medicine",
    },
    {
        value: "13",
        label: "Pharmacy",
    },
    {
        value: "5",
        label: "Physiatry",
    },
    {
        value: "6",
        label: "Pulmonary Function Testing",
    },
    {
        value: "14",
        label: "Radiology",
    },
    {
        value: "11",
        label: "Rehabilitation Services",
    },
    {
        value: "9",
        label: "Sports Medicine Center",
    },
    {
        value: "8",
        label: "Surgical Specialties",
    },
    {
        value: "46",
        label: "Surgi-Care",
    },
    {
        value: "16",
        label: "Urology",
    },
    {
        value: "1",
        label: "Urgent Care Center",
    },
];

export const PP22_LOCATIONS = [
    {
        value: "17",
        label: "Blood Draw/Phlebotomy",
    },
    {
        value: "49",
        label: "Bridge",
    },
    {
        value: "18",
        label: "Community Room",
    },
    {
        value: "22",
        label: "Mass General Hospital for Children",
    },
    {
        value: "20",
        label: "Multi Specialty Clinic",
    },
    {
        value: "21",
        label: "Patient Financial Services",
    },
    {
        value: "19",
        label: "Primary Care",
    },
    {
        value: "23",
        label: "Spaulding Outpatient Center for Children",
    },
];

export const CHESTNUT_LOCATIONS = [
    {
        value: "24",
        label: "Allergy and Clinical Immunology (Floor 3)",
    },
    {
        value: "42",
        label: "Allergy and Clinical Immunology (Floor 5)",
    },
    {
        value: "25",
        label: "Backup Child Care Center",
    },
    {
        value: "26",
        label: "Brigham Dermatology Associates (BDA)",
    },
    {
        value: "27",
        label: "Brigham Obstetrics and Gynecology Group (BOGG)",
    },
    {
        value: "28",
        label: "Brigham Physicians Group (BPG, Floor 4)",
    },
    {
        value: "43",
        label: "Brigham Physicians Group (BPG, Floor 5)",
    },
    {
        value: "29",
        label: "Brigham Psychiatric Specialties",
    },
    {
        value: "30",
        label: "Center for Pain Medicine",
    },
    {
        value: "31",
        label: "Crohn's and Colitis Center",
    },
    {
        value: "32",
        label: "Endoscopy Center",
    },
    {
        value: "33",
        label: "Gretchen S. and Edward A. Fish Center for Women's Health",
    },
    {
        value: "34",
        label: "Laboratory",
    },
    {
        value: "35",
        label: "Multi-Specialty Clinic",
    },
    {
        value: "36",
        label: "Osher Clinical Center for Integrative Health",
    },
    {
        value: "37",
        label: "Patient Financial Services",
    },
    {
        value: "38",
        label: "Pharmacy",
    },
    {
        value: "39",
        label: "Radiology",
    },
    {
        value: "40",
        label: "Radiology, MRI/CT Scan",
    },
    {
        value: "41",
        label: "Rehabilitation Services",
    },
];

export const FAULKNER_LOCATIONS = [
    { value: "50", label: "Admitting/Registration" },
    { value: "51", label: "Atrium Café" },
    { value: "52", label: "Audiology" },
    { value: "69", label: "Biomedical Engineering" },
    { value: "53", label: "Blood Drawing Lab" },
    { value: "108", label: "Boston ENT Associates" },
    { value: "80", label: "Cafeteria" },
    { value: "54", label: "Cardiac Rehab" },
    { value: "92", label: "Cardiology" },
    { value: "81", label: "Chapel" },
    { value: "109", label: "Endocrinology/Diabetes/Hematology" },
    { value: "55", label: "Emergency Department" },
    { value: "56", label: "Emergency Entrance" },
    { value: "82", label: "Family/Patient Resources" },
    { value: "93", label: "Foot and Ankle Center" },
    { value: "70", label: "Food Services" },
    { value: "94", label: "Gastroenterology Associates" },
    { value: "83", label: "Gift Shop" },
    { value: "57", label: "GI Endoscopy" },
    { value: "84", label: "Gynecology & Oncology" },
    { value: "110", label: "Headache" },
    { value: "85", label: "Huvos Auditorium" },
    { value: "95", label: "HVMA Internal Medicine" },
    { value: "96", label: "HVMA Neurology" },
    { value: "111", label: "ICU" },
    { value: "58", label: "Information" },
    { value: "86", label: "Information" },
    { value: "112", label: "Internal Medicine" },
    { value: "97", label: "Medical Library" },
    { value: "98", label: "Medical Records" },
    { value: "99", label: "MOHS Clinic" },
    { value: "71", label: "Morgue" },
    { value: "59", label: "MRI/CT" },
    { value: "100", label: "Neurology" },
    { value: "87", label: "Obstetrics and Gynecology Associates" },
    { value: "72", label: "Occupational Therapy" },
    { value: "113", label: "Oncology Clinic" },
    { value: "73", label: "Otolaryngology" },
    { value: "114", label: "Orthopaedics Associates" },
    { value: "88", label: "Outdoor Dining Terrace" },
    { value: "115", label: "Outpatient Infusion Center" },
    { value: "60", label: "Patient Finances" },
    { value: "74", label: "Pharmacy" },
    { value: "75", label: "Physical Therapy" },
    { value: "76", label: "Plastic Surgery" },
    { value: "61", label: "Pre-Admittance Screening" },
    { value: "101", label: "Primary Care Physicians" },
    { value: "116", label: "Primary Care Physicians" },
    { value: "77", label: "Psychiatric Inpatient Care" },
    { value: "78", label: "Psychiatric/Addiction Recovery" },
    { value: "62", label: "Pulmonary Lab" },
    { value: "102", label: "Pulmonary Services" },
    { value: "103", label: "Rheumatology Center" },
    { value: "63", label: "Radiology" },
    { value: "79", label: "Rehabilitation Services" },
    { value: "89", label: "Roslindale Pediatric Associates" },
    { value: "104", label: "Sadowsky Conference Room" },
    { value: "90", label: "Shuttle Pickup" },
    { value: "105", label: "Social Work" },
    { value: "64", label: "Special Testing" },
    { value: "65", label: "Starbucks" },
    { value: "117", label: "Surgical Specialties" },
    { value: "66", label: "Taiclet Family Center" },
    { value: "106", label: "Tynan Conference Room" },
    { value: "107", label: "Urology" },
    { value: "67", label: "Valet Parking" },
    { value: "91", label: "Volunteer Services" },
    { value: "118", label: "X-Ray" },
    { value: "119", label: "X-Ray Waiting Room" },
];

export const BWH_LOCATIONS = [
    { value: "128", label: "Ambulatory Radiology (X-ray & CT Scan)" },
    { value: "188", label: "Bornstein Amphitheater" },
    { value: "189", label: "Boston Children's Hospital" },
    { value: "149", label: "Bridge Clinic, Dushku-Palandjian" },
    { value: "127", label: "Braunwald Tower Building" },
    { value: "129", label: "Breast Imaging, Lee Bell Center" },
    { value: "190", label: "Bretholtz Family Center" },
    { value: "150", label: "Brigham Circle Medical Associates (BCMA)" },
    { value: "151", label: "Brigham Medical Specialties / Schuster Transplant" },
    { value: "191", label: "Cafeteria" },
    { value: "130", label: "Cardiovascular Imaging Center" },
    { value: "192", label: "Carrie Hall Conference Room" },
    { value: "160", label: "Center for Fetal Medicine & Reproductive Genetics" },
    { value: "161", label: "Center for Infertility & Reproductive Surgery" },
    { value: "152", label: "Center for Weight Management & Metabolic Surgery" },
    { value: "193", label: "Chapel, Multi Faith" },
    { value: "162", label: "Chest Disease" },
    { value: "166", label: "Comprehensive Breast Health Center" },
    { value: "124", label: "Connors Center" },
    { value: "163", label: "Connors Center for Women's Health" },
    { value: "131", label: "Cross-Sectional Interventional Radiology" },
    { value: "194", label: "Dana-Farber Cancer Institute" },
    { value: "125", label: "Dana-Farber Cancer Inpatient Hospital" },
    { value: "195", label: "Dana-Farber Cancer Institute Inpatient Hospital" },
    { value: "164", label: "Dental Group / Oral Medicine" },
    { value: "132", label: "Day Surgery Check-in / Pre-Op" },
    { value: "133", label: "Dialysis" },
    { value: "153", label: "Endocrine - Diabetes" },
    { value: "134", label: "Endoscopy" },
    { value: "167", label: "Echocardiography Lab (ECHO)" },
    { value: "168", label: "Electrophysiology" },
    { value: "120", label: "Emergency (75 Francis)" },
    { value: "165", label: "Ear, Nose, and Throat (ENT)" },
    { value: "154", label: "Gastroenterology & Hepatology" },
    { value: "155", label: "Genetics & Genomics Medicine" },
    { value: "169", label: "Gynecologic Oncology" },
    { value: "135", label: "High Risk Obstetric Ultrasound" },
    { value: "136", label: "Infusion" },
    { value: "156", label: "Infectious Disease" },
    { value: "170", label: "Infertility & Reproductive Surgery" },
    { value: "171", label: "International Patient Center / Executive Health" },
    { value: "172", label: "Jen Center for Primary Care" },
    { value: "157", label: "Kidney/Pancreas Transplant" },
    { value: "158", label: "Kidney Medicine" },
    { value: "196", label: "Kraft Blood Donor Center" },
    { value: "173", label: "Lung Center" },
    { value: "137", label: "Mammography" },
    { value: "174", label: "Maternal Fetal Medicine" },
    { value: "197", label: "Medical Records / Film Library" },
    { value: "175", label: "Minimally Invasive Gynecologic Surgery" },
    { value: "176", label: "Neurology" },
    { value: "138", label: "Nuclear Medicine & Molecular Imaging" },
    { value: "159", label: "Nutrition" },
    { value: "178", label: "Orthopedics" },
    { value: "121", label: "Obstetrics Admitting (75 Francis)" },
    { value: "139", label: "Outpatient X-ray" },
    { value: "198", label: "Patient Financial Registration" },
    { value: "199", label: "Pharmacy" },
    { value: "141", label: "Phlebotomy, Outpatient" },
    { value: "179", label: "Plastic & Reconstructive Surgery" },
    { value: "180", label: "Podiatry" },
    { value: "140", label: "PACU" },
    { value: "181", label: "Rehabilitation Services PT / OT" },
    { value: "145", label: "Reproductive Endocrinology Lab" },
    { value: "182", label: "Rheumatology" },
    { value: "142", label: "Radiation Oncology" },
    { value: "200", label: "Radiation Procedural Check-in" },
    { value: "143", label: "Radiology (MRI and CSIR)" },
    { value: "144", label: "Radiology (MRI and CT Scan)" },
    { value: "146", label: "Shapiro Procedural Check-in" },
    { value: "126", label: "Shapiro Cardiovascular" },
    { value: "201", label: "Shapiro Family Center" },
    { value: "122", label: "Sharf Admitting Center (75 Francis)" },
    { value: "183", label: "Thoracic Surgery Clinic" },
    { value: "147", label: "Ultrasound" },
    { value: "184", label: "Urology" },
    { value: "148", label: "Vascular Diagnostic Laboratory" },
    { value: "185", label: "Watkins Cardiovascular Clinic" },
    { value: "186", label: "Weiner Center for Pre-Op Evaulation" },
    { value: "187", label: "Wound Care Center" },
];

export const LANGUAGES = [
    {
        value: "Arabic",
        label: "Arabic",
    },
    {
        value: "Armenian",
        label: "Armenian",
    },
    {
        value: "Dutch",
        label: "Dutch",
    },
    {
        value: "French",
        label: "French",
    },
    {
        value: "German",
        label: "German",
    },
    {
        value: "Greek",
        label: "Greek",
    },
    {
        value: "Hebrew",
        label: "Hebrew",
    },
    {
        value: "Hindi",
        label: "Hindi",
    },
    {
        value: "Italian",
        label: "Italian",
    },
    {
        value: "Japanese",
        label: "Japanese",
    },
    {
        value: "Korean",
        label: "Korean",
    },
    {
        value: "MandarinChinese",
        label: "Mandarin Chinese",
    },
    {
        value: "Persian",
        label: "Persian",
    },
    {
        value: "Polish",
        label: "Polish",
    },
    {
        value: "Portuguese",
        label: "Portuguese",
    },
    {
        value: "Russian",
        label: "Russian",
    },
    {
        value: "Spanish",
        label: "Spanish",
    },
    {
        value: "Tagalog",
        label: "Tagalog",
    },
    {
        value: "Urdu",
        label: "Urdu",
    },
    {
        value: "Vietnamese",
        label: "Vietnamese",
    },
];

export const PRIORITY = [
    {
        value: "Low",
        label: "Low",
    },
    {
        value: "Medium",
        label: "Medium",
    },
    {
        value: "High",
        label: "High",
    },
    {
        value: "Emergency",
        label: "Emergency",
    },
];

export const DEVICES = [
    {
        value: "AED",
        label: "AED",
    },
    {
        value: "EKG",
        label: "EKG",
    },
    {
        value: "Defibrillator",
        label: "Defibrillator",
    },
    {
        value: "IVDrip",
        label: "IV Drip",
    },
    {
        value: "CoffeeMachine",
        label: "Coffee Machine",
    },
    {
        value: "LeadJacket",
        label: "Lead Jacket",
    },
    {
        value: "Ophthalmoscope",
        label: "Ophthalmoscope",
    },
    {
        value: "Ventilator",
        label: "Ventilator",
    },
];

export const MAINTENANCE = [
    {
        value: "ReplaceLightBulbs",
        label: "Replace Light Bulbs",
    },
    {
        value: "BrokenHardware",
        label: "Broken Hardware",
    },
    {
        value: "Electrical",
        label: "Electrical",
    },
    {
        value: "Plumbing",
        label: "Plumbing",
    },
    {
        value: "BrokenSoftware",
        label: "Broken Software",
    },
    {
        value: "Elevator",
        label: "Elevator",
    },
    {
        value: "HVAC",
        label: "HVAC",
    },
    {
        value: "Other",
        label: "Other",
    },
];

export const SECURITY = [
    { value: "Fire", label: "Fire" },
    {
        value: "HazardousMaterialRelease",
        label: "Hazardous Material Release",
    },
    {
        value: "MedicalEmergency",
        label: "Medical Emergency",
    },
    { value: "TraumaPatient", label: "Trauma Patient" },
    { value: "InfectiousEvent", label: "Infectious Event" },
    { value: "ChildAbduction", label: "Child Abduction" },
    { value: "Security", label: "Security" },
    {
        value: "HostileSituation",
        label: "Hostile Situation",
    },
    { value: "ActiveShooter", label: "Active Shooter" },
    { value: "BombThreat", label: "Bomb Threat" },
];

export const SANITATION = [
    { value: "Biohazard", label: "Biohazard" },
    { value: "FluidSpill", label: "Fluid Spill" },
    { value: "TurnOver", label: "Turn Over" },
    { value: "Sanitize", label: "Sanitize" },
    { value: "Trash", label: "Trash" },
    { value: "PestControl", label: "Pest Control" },
];

export const TRANSPORTATION = [
    { value: "Ambulance", label: "Ambulance" },
    { value: "Stretcher", label: "Stretcher" },
    { value: "Wheelchair", label: "Wheelchair" },
    { value: "Helicopter", label: "Helicopter" },
    { value: "MobileIntensiveCareUnit", label: "Mobile Intensive Care Unit" },
];

export const AV = [
    { value: "Microphone", label: "Microphone" },
    { value: "Speaker", label: "Speaker" },
    { value: "Projector", label: "Projector" },
    { value: "TV", label: "TV" },
    { value: "Camera", label: "Camera" },
];
