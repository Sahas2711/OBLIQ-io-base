-- OBLIQ-io Dummy Data Seed
-- Run this AFTER creating your first user account via the app.
-- Replace 'YOUR_USER_UUID' with your auth.users id from Supabase dashboard.
-- You can find it in: Authentication → Users → copy the UUID

-- ─── Step 1: Create a firm ───
INSERT INTO firms (id, name) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kumar & Associates, Chartered Accountants');

-- ─── Step 2: Create your profile ───
-- ⚠️ Replace YOUR_USER_UUID with your actual auth.users UUID
INSERT INTO profiles (id, firm_id, full_name, email, role) VALUES
  ('YOUR_USER_UUID', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rajesh Kumar', 'rajesh@kumarca.com', 'partner');

-- ─── Step 3: Create clients ───
INSERT INTO clients (id, firm_id, name, email, phone, pan, entity_type, status, firm_name, assigned_to, compliance_types) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Priya Sharma', 'priya@sharmaenterprises.com', '+91-9876543210', 'ABCPS1234A', 'company', 'active', 'Sharma Enterprises Pvt Ltd', 'YOUR_USER_UUID', ARRAY['gst', 'income_tax', 'tds']),
  ('c0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Amit Patel', 'amit@pateltrading.co', '+91-9876543211', 'BDPPP2345B', 'partnership', 'active', 'Patel Trading Co', 'YOUR_USER_UUID', ARRAY['gst', 'income_tax']),
  ('c0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sneha Reddy', 'sneha@reddyinfra.com', '+91-9876543212', 'CDEPR3456C', 'company', 'active', 'Reddy Infrastructure Ltd', 'YOUR_USER_UUID', ARRAY['gst', 'income_tax', 'tds', 'roc']),
  ('c0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Vikram Singh', 'vikram@singhmanufacturing.in', '+91-9876543213', 'EFSVS4567D', 'company', 'onboarding', 'Singh Manufacturing Pvt Ltd', 'YOUR_USER_UUID', ARRAY['gst', 'tds', 'audit']),
  ('c0000005-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ananya Gupta', 'ananya@guptaassociates.com', '+91-9876543214', 'FGHAG5678E', 'individual', 'active', NULL, 'YOUR_USER_UUID', ARRAY['income_tax']),
  ('c0000006-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deepak Mehta', 'deepak@mehtatech.io', '+91-9876543215', 'GIJDM6789F', 'llp', 'active', 'Mehta Tech LLP', 'YOUR_USER_UUID', ARRAY['gst', 'income_tax', 'roc']),
  ('c0000007-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kavita Joshi', 'kavita@joshifoods.in', '+91-9876543216', 'HJKJJ7890G', 'partnership', 'inactive', 'Joshi Foods', NULL, ARRAY['gst']),
  ('c0000008-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rahul Verma', 'rahul@vermaconstructions.com', '+91-9876543217', 'IJLVV8901H', 'company', 'active', 'Verma Constructions Pvt Ltd', 'YOUR_USER_UUID', ARRAY['gst', 'income_tax', 'tds', 'audit']);

-- ─── Step 4: Create compliance tasks ───
INSERT INTO compliance_tasks (id, firm_id, client_id, title, description, category, status, priority, assigned_to, due_date, financial_year, period, document_required, documents_uploaded, documents_total) VALUES
  -- Sharma Enterprises tasks
  ('t0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 'GST Return Filing - July 2025', 'File GSTR-1 and GSTR-3B for July 2025', 'gst', 'completed', 'high', 'YOUR_USER_UUID', '2025-08-20', '2025-26', 'Q1', true, 2, 2),
  ('t0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 'TDS Return Filing - Q1', 'File TDS returns for Q1 FY 2025-26', 'tds', 'in_progress', 'high', 'YOUR_USER_UUID', '2025-07-31', '2025-26', 'Q1', true, 1, 3),
  ('t0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 'Income Tax Return - FY 2024-25', 'Prepare and file ITR-6 for Sharma Enterprises', 'income_tax', 'awaiting_documents', 'urgent', 'YOUR_USER_UUID', '2025-07-31', '2024-25', 'Annual', true, 0, 4),

  -- Patel Trading tasks
  ('t0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002', 'GST Annual Return', 'File GSTR-9 for FY 2024-25', 'gst', 'in_progress', 'medium', 'YOUR_USER_UUID', '2025-12-31', '2024-25', 'Annual', true, 1, 2),
  ('t0000005-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002', 'Partnership Firm ITR', 'File ITR-5 for Patel Trading Co', 'income_tax', 'not_started', 'high', 'YOUR_USER_UUID', '2025-09-15', '2024-25', 'Annual', true, 0, 3),

  -- Reddy Infrastructure tasks
  ('t0000006-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 'ROC Annual Filing', 'File annual return and financial statements with ROC', 'roc', 'overdue', 'urgent', 'YOUR_USER_UUID', '2025-07-30', '2024-25', 'Annual', true, 0, 5),
  ('t0000007-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 'GST Return Filing - August 2025', 'File GSTR-1 and GSTR-3B for August 2025', 'gst', 'not_started', 'medium', 'YOUR_USER_UUID', '2025-09-20', '2025-26', 'Q2', true, 0, 2),
  ('t0000008-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 'TDS Certificate Issuance', 'Issue Form 16/16A for Q1 FY 2025-26', 'tds', 'completed', 'medium', 'YOUR_USER_UUID', '2025-08-15', '2025-26', 'Q1', true, 3, 3),

  -- Singh Manufacturing tasks
  ('t0000009-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004', 'GST Registration', 'Complete GST registration process for new entity', 'gst', 'in_progress', 'high', 'YOUR_USER_UUID', '2025-08-25', '2025-26', 'Annual', true, 1, 2),
  ('t0000010-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004', 'Statutory Audit Planning', 'Plan and schedule statutory audit for FY 2024-25', 'audit', 'not_started', 'medium', 'YOUR_USER_UUID', '2025-10-15', '2024-25', 'Annual', false, 0, 0),

  -- Gupta Associates tasks
  ('t0000011-0000-0000-0000-000000000011', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000005-0000-0000-0000-000000000005', 'Individual ITR Filing', 'File ITR-4 for Ananya Gupta (Sugam)', 'income_tax', 'completed', 'high', 'YOUR_USER_UUID', '2025-07-31', '2024-25', 'Annual', true, 3, 3),

  -- Mehta Tech tasks
  ('t0000012-0000-0000-0000-000000000012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000006-0000-0000-0000-000000000006', 'LLP Annual Return', 'File Form 11 and Form 8 for Mehta Tech LLP', 'roc', 'under_review', 'high', 'YOUR_USER_UUID', '2025-09-30', '2024-25', 'Annual', true, 2, 3),
  ('t0000013-0000-0000-0000-000000000013', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000006-0000-0000-0000-000000000006', 'GST Return - August 2025', 'File GSTR-1 for August 2025', 'gst', 'not_started', 'low', 'YOUR_USER_UUID', '2025-09-20', '2025-26', 'Q2', true, 0, 1),

  -- Verma Constructions tasks
  ('t0000014-0000-0000-0000-000000000014', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 'GST Return Filing - July 2025', 'File GSTR-1 and GSTR-3B for construction company', 'gst', 'completed', 'high', 'YOUR_USER_UUID', '2025-08-20', '2025-26', 'Q1', true, 2, 2),
  ('t0000015-0000-0000-0000-000000000015', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 'TDS on Contractor Payments', 'Deduct and deposit TDS under Section 194C', 'tds', 'in_progress', 'urgent', 'YOUR_USER_UUID', '2025-08-07', '2025-26', 'Q2', true, 0, 2),
  ('t0000016-0000-0000-0000-000000000016', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 'Tax Audit Report', 'Prepare tax audit report under Section 44AB', 'audit', 'awaiting_documents', 'urgent', 'YOUR_USER_UUID', '2025-09-30', '2024-25', 'Annual', true, 0, 6);

-- ─── Step 5: Create documents ───
INSERT INTO documents (id, firm_id, client_id, task_id, name, type, status, uploaded_by, uploaded_at, due_date, file_size) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 't0000001-0000-0000-0000-000000000001', 'Sales Register July 2025', 'spreadsheet', 'approved', 'Priya Sharma', '2025-08-10', '2025-08-15', '245 KB'),
  ('d0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 't0000001-0000-0000-0000-000000000001', 'Purchase Register July 2025', 'spreadsheet', 'approved', 'Priya Sharma', '2025-08-10', '2025-08-15', '189 KB'),
  ('d0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 't0000002-0000-0000-0000-000000000002', 'TDS Deduction Statement Q1', 'pdf', 'uploaded', 'Priya Sharma', '2025-07-28', '2025-07-30', '312 KB'),
  ('d0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 't0000002-0000-0000-0000-000000000002', 'Form 26Q Challan', 'pdf', 'requested', NULL, NULL, '2025-07-30', NULL),
  ('d0000005-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 't0000006-0000-0000-0000-000000000006', 'Board Resolution', 'pdf', 'requested', NULL, NULL, '2025-07-25', NULL),
  ('d0000006-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 't0000006-0000-0000-0000-000000000006', 'Balance Sheet FY 2024-25', 'pdf', 'requested', NULL, NULL, '2025-07-25', NULL),
  ('d0000007-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000006-0000-0000-0000-000000000006', 't0000012-0000-0000-0000-000000000012', 'LLP Agreement', 'pdf', 'approved', 'Deepak Mehta', '2025-08-01', '2025-09-25', '520 KB'),
  ('d0000008-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000006-0000-0000-0000-000000000006', 't0000012-0000-0000-0000-000000000012', 'Profit & Loss Statement', 'spreadsheet', 'uploaded', 'Deepak Mehta', '2025-08-05', '2025-09-25', '890 KB'),
  ('d0000009-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 't0000016-0000-0000-0000-000000000016', 'Books of Accounts FY 2024-25', 'pdf', 'requested', NULL, NULL, '2025-09-15', NULL),
  ('d0000010-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 't0000016-0000-0000-0000-000000000016', 'Bank Statements FY 2024-25', 'pdf', 'requested', NULL, NULL, '2025-09-15', NULL);

-- ─── Step 6: Create activities ───
INSERT INTO activities (id, firm_id, user_id, user_name, action, description, client_id, client_name, is_ai, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'task_completed', 'Completed GST Return Filing for Sharma Enterprises', 'c0000001-0000-0000-0000-000000000001', 'Priya Sharma', false, '2025-08-15 10:30:00+05:30'),
  ('a0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'document_received', 'Received Sales Register from Sharma Enterprises', 'c0000001-0000-0000-0000-000000000001', 'Priya Sharma', false, '2025-08-10 14:20:00+05:30'),
  ('a0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'AI Assistant', 'deadline_alert', 'ROC Annual Filing for Reddy Infrastructure is overdue. Immediate action required.', 'c0000003-0000-0000-0000-000000000003', 'Sneha Reddy', true, '2025-08-01 09:00:00+05:30'),
  ('a0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'client_added', 'Onboarded Singh Manufacturing Pvt Ltd as new client', 'c0000004-0000-0000-0000-000000000004', 'Vikram Singh', false, '2025-07-25 11:00:00+05:30'),
  ('a0000005-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'AI Assistant', 'compliance_tip', 'Tax audit under Section 44AB is mandatory for Verma Constructions as turnover exceeds ₹1 crore. Consider Section 44ADA for presumptive taxation if applicable.', 'c0000008-0000-0000-0000-000000000008', 'Rahul Verma', true, '2025-07-28 16:45:00+05:30'),
  ('a0000006-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'task_created', 'Created TDS on Contractor Payments task for Verma Constructions', 'c0000008-0000-0000-0000-000000000008', 'Rahul Verma', false, '2025-07-20 09:15:00+05:30'),
  ('a0000007-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'document_approved', 'Approved LLP Agreement for Mehta Tech', 'c0000006-0000-0000-0000-000000000006', 'Deepak Mehta', false, '2025-08-02 11:30:00+05:30'),
  ('a0000008-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'AI Assistant', 'risk_assessment', 'High risk: TDS return for Sharma Enterprises due in 2 days. Only 1 of 3 documents uploaded. Follow up urgently.', 'c0000001-0000-0000-0000-000000000001', 'Priya Sharma', true, '2025-07-29 10:00:00+05:30'),
  ('a0000009-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YOUR_USER_UUID', 'Rajesh Kumar', 'task_completed', 'Completed Individual ITR Filing for Ananya Gupta', 'c0000005-0000-0000-0000-000000000005', 'Ananya Gupta', false, '2025-07-30 17:00:00+05:30'),
  ('a0000010-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'AI Assistant', 'recommendation', 'Consider implementing automated GST reconciliation for Patel Trading Co to reduce manual errors and save time during return filing.', NULL, NULL, true, '2025-08-05 14:30:00+05:30');

-- ─── Step 7: Create task notes ───
INSERT INTO task_notes (id, firm_id, task_id, user_id, user_name, content, created_at) VALUES
  ('n0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 't0000002-0000-0000-0000-000000000002', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Client has uploaded TDS deduction statement. Pending Form 26Q challan copy.', '2025-07-28 11:00:00+05:30'),
  ('n0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 't0000003-0000-0000-0000-000000000003', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Waiting for audited financial statements from client. Sent reminder on 25th July.', '2025-07-25 15:30:00+05:30'),
  ('n0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 't0000006-0000-0000-0000-000000000006', 'YOUR_USER_UUID', 'Rajesh Kumar', 'ROC filing is severely overdue. Client needs to arrange board resolution and updated MOA/AOA.', '2025-08-01 09:15:00+05:30'),
  ('n0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 't0000016-0000-0000-0000-000000000016', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Tax audit scope: Section 44AB applicable. Need books of accounts, bank statements, and asset register.', '2025-07-20 10:00:00+05:30');

-- ─── Step 8: Create client notes ───
INSERT INTO client_notes (id, firm_id, client_id, user_id, user_name, content, created_at) VALUES
  ('cn000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Long-standing client. Very responsive with document submissions. Prefers email communication.', '2025-07-15 10:00:00+05:30'),
  ('cn000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003', 'YOUR_USER_UUID', 'Rajesh Kumar', 'New infrastructure company. Complex compliance requirements with multiple ROC filings. Contact person: Mr. Nair (CFO).', '2025-07-20 14:00:00+05:30'),
  ('cn000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000008-0000-0000-0000-000000000008', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Construction company with high transaction volumes. Requires quarterly TDS compliance. Prefer WhatsApp for quick follow-ups.', '2025-07-18 11:30:00+05:30'),
  ('cn000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004', 'YOUR_USER_UUID', 'Rajesh Kumar', 'Recently onboarded. Manufacturing sector. Needs GST registration, TDS setup, and statutory audit for FY 2024-25.', '2025-07-25 11:15:00+05:30');
