// import amqp from "amqplib/callback_api.js";

// export class RabbitMQ {
//     static instance = null;

//     constructor() {
//         if (RabbitMQ.instance) {
//             return RabbitMQ.instance;
//         }
//         this.connection = null;
//         RabbitMQ.instance = this;
//     }

//     connect(callback) {
//         if (this.connection) {
//             callback(this.connection);
//             return;
//         }

//         const url = `amqp://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}/`;
//         amqp.connect(url, (error, connection) => {
//             if (error) {
//                 throw error;
//             }
//             this.connection = connection;
//             callback(connection);
//         });
//     }
// }