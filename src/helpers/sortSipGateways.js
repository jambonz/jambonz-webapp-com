
const sortSipGateways = sipGateways => {
  sipGateways.sort((a, b) => {
    const ip = a => (a.ipv4 && a.ipv4.toLowerCase()) || '';
    const port = a => (a.port && a.port.toString().padStart(5,0)) || '';
    let valA = `${ip(a)}:${port(a)}`;
    let valB = `${ip(b)}:${port(b)}`;
    return valA > valB ? 1 : valA < valB ? -1 : 0;
  });
  return sipGateways;
};

export default sortSipGateways;
