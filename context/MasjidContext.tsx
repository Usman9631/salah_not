import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type Masjid = any; // Replace 'any' with your actual Masjid type if you have one

type MasjidContextType = {
  masjid: Masjid;
  setMasjid: Dispatch<SetStateAction<Masjid>>;
};

export const MasjidContext = createContext<MasjidContextType | undefined>(undefined);

type MasjidProviderProps = {
  children: ReactNode;
};

export function MasjidProvider({ children }: MasjidProviderProps) {
  const [masjid, setMasjid] = useState<Masjid | null>(null);

  return (
    <MasjidContext.Provider value={{ masjid, setMasjid }}>
      {children}
    </MasjidContext.Provider>
    );
}