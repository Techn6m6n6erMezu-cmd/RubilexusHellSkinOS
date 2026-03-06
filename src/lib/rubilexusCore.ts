export const SOVEREIGN_IDENTITY = {
  header: "FILTHSYSTEM-SOULS.EXE // SOVEREIGN PLATFORM v6.66",
  subHeader: "Satan's World Terminal Interface - Soulseline Active",
  status: "DIVINE AUTHORITY: ENABLED",
  admin: "ADMIN 1: TECHNOMANCER ACCESS GRANTED"
};

export const updateTerminalBranding = () => {
  document.title = "FilthSystem-soulS.EXE";
  console.log("%c " + SOVEREIGN_IDENTITY.header, "color: red; font-weight: bold;");
};
