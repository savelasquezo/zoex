function getRandomTickets(aviableTickets: number[], num: number): number[] {
  const shuffledTickets = aviableTickets?.slice();
  let selectedTickets: number[] = [];

  while (selectedTickets.length < num && shuffledTickets.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffledTickets.length);
    selectedTickets.push(shuffledTickets[randomIndex]);
    shuffledTickets.splice(randomIndex, 1);
  }

  return selectedTickets;
}

export { getRandomTickets };