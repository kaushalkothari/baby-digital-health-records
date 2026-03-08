

# 👶 Baby Health Tracker

A personal app to track your children's health records — hospital visits, growth, vaccinations, prescriptions, and documents — all in one place. No login needed; data stored locally in the browser.

## Pages & Features

### 1. Dashboard
- Overview cards for each child showing: last visit date, next vaccination due, latest weight/height
- Quick-add buttons for new visit, vaccination, or document

### 2. Child Profiles
- Add/edit multiple children with name, date of birth, photo, blood group
- Switch between children easily via sidebar or tabs

### 3. Hospital Visits Log
- Add visits with: date, hospital/clinic name, doctor name, reason, description/notes
- Record weight, height, head circumference, temperature (optional fields)
- View visit history as a timeline/list with search and filters

### 4. Growth Charts
- Visual charts (line/area) tracking weight and height over time using Recharts
- Milestone markers on the timeline

### 5. Vaccination Tracker
- Pre-loaded standard infant vaccination schedule
- Track due date, completed date, vaccine name, batch number, administered by
- Status badges: Upcoming, Overdue, Completed
- Filter/sort by status

### 6. Prescriptions
- Log prescriptions: medicine name, dosage, frequency, duration, prescribing doctor, date
- Mark as active/completed

### 7. Document Uploads
- Upload and organize receipts, lab reports, discharge summaries, prescriptions (images/PDFs)
- Categorize by type and link to a specific visit
- View/download uploaded files

### 8. Receipts & Billing
- Track hospital bills: date, amount, hospital, description
- Attach receipt images
- Summary view with total spending

## Data Storage
- All data persisted in browser localStorage (no backend needed)
- Export all data as JSON for backup
- Import data from JSON backup

## Design
- Clean, warm, friendly UI with soft colors (pastels)
- Mobile-responsive for on-the-go use at clinics
- Card-based layout with intuitive navigation sidebar

