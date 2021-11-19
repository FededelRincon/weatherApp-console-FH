const fs = require('fs');
const axios = require('axios');


class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        // cada palabra en mayusculas

        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY, //si no lo encuentra manda un undefined
            'limit': 5,
            'language': 'es'
        }
    }
    
    get paramsOpenWeatherMap() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric',
        }
    }



    async ciudad ( lugar = '' ) {

        try {
            // Peticion http
            const instance = axios.create({
                // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?language=es&access_token=pk.eyJ1IjoicGFxdWV0aW5obyIsImEiOiJja2sycDc4YzAxM2kyMm9tZm8ybWg3emdrIn0.6XhGimBpY4H5p_zjExagpg&limit=5');
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            
            return resp.data.features.map( lugar => ({  //map me da el [] y yo devuelvo adentro {} x cada objeto q tenga, osea 5 en este caso 
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))

        } catch (error) {
            // throw error          //opc 1 - crashea todo
            // console.log(error)   //opc 2 - muestra un msj en consola
            return [];
        }
    }


    async climaLugar( lat, lon ) {

        try {
            // instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeatherMap, lat, lon }
            })
            const resp = await instance.get();

            // resp.data
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }

        } catch (error) {
            console.log(error)
        }
    }


    agregarHistorial( lugar = '' ) {

        //TODO: prevenir duplicados
        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return; //si ya existe no hagas nada
        } else {
            this.historial = this.historial.splice(0,4);    //asi mantengo solo 5 en el historial, 4 aca y 1 mas abajo

            this.historial.unshift( lugar.toLocaleLowerCase() );
        }

        //grabar en DB
        this.guardarDB();


    }

    guardarDB() {

        const payload = {
            historial: this.historial,
            //x si quisiera guardar mas cosas
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));

    }

    leerDB() {

        // debe de existir
        if ( !fs.existsSync( this.dbPath )) {
            return null;    //si no existe chau, no hagas nada
        }

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8' });

        if (!info) return;

        const data = JSON.parse(info)

        this.historial = data.historial;
    }

}



module.exports = Busquedas;