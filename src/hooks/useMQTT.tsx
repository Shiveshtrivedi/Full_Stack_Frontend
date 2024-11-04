import { useEffect } from 'react';
import mqtt from 'mqtt';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

interface TopicHandler {
  topic: string;
  onMessage: (message: string) => void;
}

export const useMQTT = (topics: TopicHandler[]) => {
  const dispatch = useDispatch<AppDispatch>();

  const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;
  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001', {
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      topics.forEach(({ topic }) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`Subscription error for ${topic}:`, err);
          } else {
            console.log(`Subscribed to ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      const handler = topics.find((t) => t.topic === topic);
      if (handler) {
        try {
          const data = JSON.parse(message.toString());
          if (data && typeof data === 'object')
            handler.onMessage(message.toString());
          console.log('topic ', topic, 'data', data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });

    return () => {
      client.end(true, () => {
        console.log('MQTT client disconnected');
      });
    };
  }, [dispatch, topics, websocketUrl]);
};
