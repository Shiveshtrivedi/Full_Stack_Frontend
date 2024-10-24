// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const mqtt = require('mqtt');

// Connect to your MQTT broker
const client = mqtt.connect('ws://localhost:9001'); // Use the correct WebSocket URL

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Simulate real-time updates every 5 seconds
  setInterval(() => {
    // Simulate an inventory update
    const userUpdate = {
      userId: Math.floor(Math.random() * 1000),
      email: 'string',
      userName: 'string',
      password: 'chin tapak dum dum',
      token: 'why require ?',
      isAdmin: true,
    };
    client.publish('user/new', JSON.stringify(userUpdate));
    console.log('published user update', userUpdate);
    // const inventoryUpdate = {
    //   productId: 1,
    //   stock: Math.floor(Math.random() * 100), // Random stock value
    // };
    // client.publish('inventory-updates', JSON.stringify(inventoryUpdate));
    // console.log('Published inventory update:', inventoryUpdate);

    // Simulate a sales update
    // const salesUpdate = {
    //   orderId: Math.floor(Math.random() * 1000),
    //   totalAmount: (Math.random() * 100).toFixed(2), // Random amount
    //   startDate: new Date().toISOString(),
    // };
    // const productadd={
    //   name:"string",
    //   image:'string',
    //   productId: Math.floor(Math.random() * 1000),
    //   userId:1,
    //   productName:'string'
    // }
    // client.publish('product/new',JSON.stringify(productadd))
    // console.log("publish product",productadd)
    // client.publish('sales-updates', JSON.stringify(salesUpdate));
    // console.log('Published sales update:', salesUpdate);
  }, 5000); // Publish updates every 5 seconds
});
