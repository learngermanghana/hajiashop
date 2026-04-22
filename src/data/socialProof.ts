const customerNames = ["Sandra", "Mariam", "Esi", "Nana", "Akosua", "Abena", "Ama", "Priscilla"] as const;
const locations = ["Accra", "Tema", "Kumasi", "Kasoa", "East Legon", "Dansoman"] as const;
const actions = [
  "just ordered a glow bundle",
  "just bought a whitening serum",
  "just ordered a lip care set",
  "just bought a skincare combo",
  "just placed an order for body mist"
] as const;
const timeAgo = ["2 mins ago", "5 mins ago", "8 mins ago", "12 mins ago", "today"] as const;

export const socialProofMessages = customerNames.map((name, index) => {
  const location = locations[index % locations.length];
  const action = actions[index % actions.length];
  const time = timeAgo[index % timeAgo.length];
  return `${name} from ${location} ${action} ${time}.`;
});

export const extraSocialProofMessages = [
  "A customer from Airport Residential just checked out today.",
  "Two customers completed orders in the last 10 minutes.",
  "Someone from Spintex asked for shade recommendations today.",
  "New WhatsApp order received from the website 4 mins ago."
] as const;
