import Selector from './../Structures/Selector';
import JsonProvider from './JsonProvider';

import { DB_TYPES } from './../Utility/Constants/AxonEnums';

/**
 * Database Selector
 * Use require to dynamically load a Database Provider depending on installed dependencies.
 *
 * @author KhaaZ
 *
 * @class DBSelector
 * @extends Selector
 */
class DBSelector extends Selector {
    static select(axonOptions, axon) {
        let DBProvider;

        // eslint-disable-next-line no-shadow
        const { db } = axonOptions.settings;

        switch (db) {
            // No database
            case DB_TYPES.DBLESS:
            default: {
                const InMemoryProvider = require('./InMemoryProvider').default;
                DBProvider = new InMemoryProvider(axon);
                axon.logger.info('Selected Database: Database-Less');
                axon.logger.warn('Configs will not change.');
                break;
            }

            // Json Database
            case DB_TYPES.JSON: {
                DBProvider = new JsonProvider(axon);
                axon.logger.info('Selected Database: JSON DB.');
                break;
            }

            // MongoDB Database
            case DB_TYPES.MONGO: {
                try {
                    const MongoService = require('./MongoProvider').default;
                    DBProvider = new MongoService(axon);
                    axon.logger.info('Selected Database: MongoDB.');
                } catch (err) {
                    DBProvider = new JsonProvider(axon);
                    axon.logger.warn('Mongoose wasn\'t found, using JSON DB instead.');
                    axon.logger.info('Selected Database: JSON DB.');
                }
                break;
            }
        }

        DBProvider.init(axonOptions);
        axon.logger.axon('DB ready.');
        return DBProvider;
    }
}

export default DBSelector;
