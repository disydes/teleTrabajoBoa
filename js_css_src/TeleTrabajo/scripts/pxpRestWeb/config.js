/**
 * Created by faviofigueroa on 6/7/16.
 */
// ?????????????????????????????????????????????????????????????????????? \\
// ? Favio Figueroa Penarrieta - JavaScript Library                     ?
// ?????????????????????????????????????????????????????????????????????? \\
// ? Copyright � 2014 Disydes (http://disydes.com)                      ?
// ?????????????????????????????????????????????????????????????????????? \\
// ? Vista para automatizar cualquier front end basado en jQuery        ? plugin para hacer peticiones ajax
// ?????????????????????????????????????????????????????????????????????? \\

(function () {


    config = {

        tipo_ruta:'DOMINIO', //PUEDE IR DOMINIO
        host : '10.150.0.91',
        usPxp:'teletrabajo', //usuario pxp
        pwdPxp:'f312f81a6d8f35e46c457782752d5b1b', //md5

        IP : {ip:"10.150.0.91",carpeta:"kerp_ismael/pxp/lib"},
        DOMINIO : {url:"erpmobile.obairlines.bo"},
        ruta_servicio : 'kerp_ismael/pxp/lib',


        init :function () {

            if(config.tipo_ruta == 'IP'){
                config.ruta_servicio = config.IP.ip+':80/'+config.IP.carpeta;
            }else{
                config.ruta_servicio = config.DOMINIO.url+':80';
            }
            console.log(config.ruta_servicio);

            
        }



    };










})
();