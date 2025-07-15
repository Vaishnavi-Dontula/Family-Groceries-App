import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://sdkvpodqedhpjodswlmg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNka3Zwb2RxZWRocGpvZHN3bG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODkzMDIsImV4cCI6MjA2ODE2NTMwMn0.QRwEALipCq8f3SHdnQUmqCNxUU42A51q4b-ECS6SSPA'
);
