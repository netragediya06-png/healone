
CREATE TABLE public.saved_remedies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  remedy_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, remedy_id)
);

ALTER TABLE public.saved_remedies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can save remedies" ON public.saved_remedies
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their saved remedies" ON public.saved_remedies
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unsave remedies" ON public.saved_remedies
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
