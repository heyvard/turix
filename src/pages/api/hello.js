export default function handler(req, res) {
    console.log('Kallet')
    return res.send({ name: 'John Doe' })
}
