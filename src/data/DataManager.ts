import { GUI } from 'lil-gui'

 class DataManager {
    private static instance: DataManager;
    public gui:GUI;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    public init(){
        this.gui = new GUI();
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
            DataManager.instance.init();
        }

        return DataManager.instance;
    }

}


export {DataManager};