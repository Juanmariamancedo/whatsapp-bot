const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

function checkRange(body){
    if(!body.includes("1") && !body.includes("2") && !body.includes("3") && !body.includes("4") && !body.includes(5)) return false
    return true
}

const afirmativeCase = addKeyword(["Si", "si", "sI", "SI"], {sensitive: true})
    .addAnswer("¿Cómo puntuaría del 1 al 5(mayor) el *trato* recibido por el personal?", {capture: true}, (ctx, { fallBack }) => {
        if(!checkRange(ctx.body)) return fallBack()
    })
    .addAnswer("¿Cómo puntuaría del 1 al 5(mayor)  la *organización* del servicio oficial?", {capture: true}, (ctx, {fallBack})=>{
        if(!checkRange(ctx.body)) return fallBack()
    })
    .addAnswer("¿Cómo puntuaría del 1 al 5(mayor) la *calidad* del servicio realizado en su vehículo?", {capture: true}, (ctx, {fallBack})=>{
        if(!checkRange(ctx.body)) return fallBack()
    })
    .addAnswer("¿Cómo puntuaría del 1 al 5(mayor) el servicio de Sebastiani en *general?*", {capture: true}, (ctx, {fallBack})=>{
        if(!checkRange(ctx.body)) return fallBack()
    })
    .addAnswer("¿Algún comentario o *observación* / *recomendación*  sobre su visita?", {capture: true}, ()=>{})
    .addAnswer("¿Qué aspectos *destacarías* sobre su visita?", {capture: true}, ()=>{})
    .addAnswer("¿Qué te parecio el *lavado*?", {capture: true}, ()=>{})
    .addAnswer("Okey, terminamos la encuesta. Muchas gracias por su tiempo!!!")

const negativeCase = addKeyword(["No", "nO", "no", "NO"], {sensitive: true}).addAnswer("Okey, muchas gracias por su tiempo!!!")

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([afirmativeCase, negativeCase])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.on("require_action", ()=>{
        QRPortalWeb()
    })
}

main()
