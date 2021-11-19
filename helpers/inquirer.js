const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`,
            },
            {
                value: 3,
                name: `${'3.'.green} Salir`,
            },
        ]
    }
];






const inquirerMenu = async () => {

    console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opcion'.white);
    console.log('=========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

const pausa = async () => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question); //como esta el await, espera a que se presione enter para continuar
}

const leerInput = async ( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0) {
                    return 'Por favor ingrese un favor'
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);   //este desc existe por el name de questions que es desc
    return desc
}


const listarLugares = async ( lugares = [] ) => {

    const choices = lugares.map( ( lugar, i ) => {

        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });

    //agregando manualmente la opcion de cancelar
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices //xq no doy opciones
        }
    ]

    const { id } = await inquirer.prompt(preguntas);

    return id;
}


const confirmar = async ( message ) => {
    
    const question = [
        {
            type: 'confirm',    //es un bool
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);

    return ok;
}


const mostrarListadoChecklist = async ( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {

        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });


    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices //xq no doy opciones
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);

    return ids;
}


module.exports = {
    inquirerMenu, 
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist,
}




