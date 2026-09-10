export type AppConnection = {
  id: string;
  name: string;
  image: string;
  description: string;
  connection: { connectedOn: string; importedActivities: string; lastSynced: string } | null;
};
