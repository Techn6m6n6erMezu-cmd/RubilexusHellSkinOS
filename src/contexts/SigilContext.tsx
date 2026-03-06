import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type SigilType = 'default_horse' | 'custom_url';

export type SigilConfig = {
  sigil_url: string;
  sigil_type: SigilType;
};

type SigilContextType = {
  sigil: SigilConfig;
  isDefault: boolean;
  updateSigil: (url: string, type: SigilType) => Promise<void>;
};

const SigilContext = createContext<SigilContextType | undefined>(undefined);

export function SigilProvider({ children }: { children: ReactNode }) {
  const [sigil, setSigil] = useState<SigilConfig>({
    sigil_url: '',
    sigil_type: 'default_horse',
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from('sigil_config')
      .select('sigil_url, sigil_type')
      .maybeSingle();
    if (data) {
      setSigil({ sigil_url: data.sigil_url, sigil_type: data.sigil_type as SigilType });
    }
  };

  const updateSigil = async (url: string, type: SigilType) => {
    const { data } = await supabase.from('sigil_config').select('id').maybeSingle();
    if (data?.id) {
      await supabase
        .from('sigil_config')
        .update({ sigil_url: url, sigil_type: type, updated_at: new Date().toISOString() })
        .eq('id', data.id);
    }
    setSigil({ sigil_url: url, sigil_type: type });
  };

  return (
    <SigilContext.Provider value={{ sigil, isDefault: sigil.sigil_type === 'default_horse', updateSigil }}>
      {children}
    </SigilContext.Provider>
  );
}

export function useSigil() {
  const ctx = useContext(SigilContext);
  if (!ctx) throw new Error('useSigil must be used within SigilProvider');
  return ctx;
}
