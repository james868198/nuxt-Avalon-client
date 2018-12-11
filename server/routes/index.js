import { Router } from 'express'

export default () => {
    const root = Router()
    const api = Router()

    root.get('/', (req, res) => {
        res.json('root')
    })

    root.use('/api', api)

    return root
}
