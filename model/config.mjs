import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE_URL, 
    {
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        },
       
        dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
        }
    })

// for local use
// const sequelize = new Sequelize(
//     {
//         host: 'localhost',
//         port: 5432,
//         dialect: 'postgres',
//         username: 'postgres',
//         password: 'admin',
//         database: 'myBooks2',
//         logging: false,
//         define: {
//             timestamps: false,
//             freezeTableName: true
//         }
//     });

export default sequelize