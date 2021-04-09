const decoratorValidator = (fn, schema, argsType) => {
    return async function (event) {
        const data = JSON.parse(event[argsType])
        // abortEarly == false -> mostra todos os erros de uma vez
        const { error, value } = await schema.validate(
            data, { abortEarly: false }
        )
        // isso altera a instância de arguments
        event[argsType] = value
        // arguments serve para pegar todos os argumentos 
        // que vieram na função e mandar para frente
        // o apply vai retornar a função que será executada posteriormente
        if(!error) return fn.apply(this, arguments)

        return {
            statusCode: 422, // unprocessable entity
            body: error.message
        }
    }
}

module.exports = decoratorValidator