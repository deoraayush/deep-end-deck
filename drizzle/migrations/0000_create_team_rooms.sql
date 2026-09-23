CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  facilitator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'full',
  actions_enabled boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'lobby',
  current_card jsonb,
  current_level int,
  cards_shown int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_room_participants_room_id ON public.room_participants(room_id);

GRANT SELECT ON public.rooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;

GRANT SELECT, INSERT ON public.room_participants TO anon;
GRANT SELECT, INSERT, DELETE ON public.room_participants TO authenticated;
GRANT ALL ON public.room_participants TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Facilitator can create rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = facilitator_id);
CREATE POLICY "Facilitator can update own rooms" ON public.rooms FOR UPDATE TO authenticated USING (auth.uid() = facilitator_id) WITH CHECK (auth.uid() = facilitator_id);
CREATE POLICY "Facilitator can delete own rooms" ON public.rooms FOR DELETE TO authenticated USING (auth.uid() = facilitator_id);

CREATE POLICY "Anyone can read participants" ON public.room_participants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can join a room" ON public.room_participants FOR INSERT TO anon, authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id)
);
CREATE POLICY "Facilitator can remove participants" ON public.room_participants FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id AND r.facilitator_id = auth.uid())
);

ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_participants REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;