const connectBLE = async () => {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ name: 'Bracelet-Sport' }],
    optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
  });
  const server = await device.gatt.connect();
  // Ensuite, accéder aux services et caractéristiques...
};
