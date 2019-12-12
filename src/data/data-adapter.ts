
const API = 'http://leaderboards.adamdill.com';
const GAMES = '/games';
const SCORES = '/scores';

const GAME_NAME = 'ele';

export class DataAdapter {

    /* STATIC CLASS: error when attempted instantiation. */
    constructor() { console.error('DataAdapter should not be instantiated'); }

    private static game:object;

    /**
     * Gets the basic game data initially and stores to prevent future calls.
     */
    private static async init():Promise<any> {
        if (this.game === undefined) {
            const response = await fetch(`${API}${GAMES}/${GAME_NAME}`);
            const json = await response.json();
            this.game = json.data;
        }
    }

    /**
     * Get the scores for the game.
     */
    public static async getScores():Promise<any> {
        await this.init();
        const response = await fetch(`${API}${SCORES}/${this.game['id']}`);
        const json = await response.json();
        return json.data;
    }


    /**
     * Used to serialize the data into the provided Class.
     * @param type 
     * @param result 
     */
    public static serialize<T>(type:new(result) => T, result:Array<object>):Array<T> {
        return result.map((value) => {
            return new type(value);
        });
    }
}


/**
 * Structure to hold the result data from the API.
 */
export class ScoreResult {
    public id:number;
    public gameId:number;
    public playerName:string;
    public timestamp:Date;
    public scores:any;

    constructor(result:any) {
        this.id         = result.id;
        this.gameId     = result.game_id;
        this.playerName = result.player_name;
        this.timestamp  = new Date(result.timestamp);
        this.scores     = result.scores;
        
        this._processScores();       
    }

    private _processScores():void {
        if (this.scores === undefined) return;

        if (this.scores.distance !== undefined) {
            this.scores.distance = parseInt(this.scores.distance);
        }
    }
}