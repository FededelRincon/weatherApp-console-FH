require('dotenv').config();

const { 
    leerInput, 
    pausa,
    inquirerMenu, 
    listarLugares, 
    climaLugar, 
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    
    // console.clear();
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1: //Buscar ciudad
                //mostrar mensaje
                const terminoBusqueda = await leerInput('Ciudad: ');
                
                //buscar los lugares
                const lugares = await busquedas.ciudad( terminoBusqueda );
                
                //Seleccionar el lugar
                const id = await listarLugares( lugares );
                //si toca 0 cancelar, no finaliza todo
                if ( id === '0' ) {
                    continue    //para que continua el ciclo
                    // break;   // sal para que no busque en la 2da api
                }

                const lugarSeleccionado = lugares.find( lugar => lugar.id === id );
                // console.log(lugarSeleccionado)
                
                //Guardar en DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );


                //clima
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );
               
                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad elegida: \n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green );
                console.log('Latitud:', lugarSeleccionado.lat );
                console.log('Longitud:', lugarSeleccionado.lng );
                console.log('Temperatura:', clima.temp );
                console.log('Minima:', clima.min );
                console.log('Maxima:', clima.max );
                console.log('Descripcion del clima:', clima.desc.green );

                break;
            case 2: //Historial
            
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                // busquedas.historial.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }`.green; 
                    console.log(`${ idx} ${ lugar } `)
                })

                break;
        }

        
        console.log(' ');   //visualmente mas bonito
        if( opt !== 3 ) await pausa();  //si es distinto de 3 pone la pausa

    } while ( opt !== 3 );




}

main();