import { Request, Response } from 'express'
import { FirebaseApp } from '../firebase'
import { firestoreCollection } from '../firestore/collection'
import { TrackData } from '../firestore/data'
import { Track } from './tracks-view-data'

export const generateTracks = (firebaseApp: FirebaseApp) => (_: Request, response: Response) => {
    const firestore = firebaseApp.firestore()
    const collection = firestoreCollection(firebaseApp)

    const tracksPromise = collection<TrackData>('tracks')

    tracksPromise.then(tracks => {
        const tracksCollection = firestore.collection('views')
            .doc('tracks_view')
            .collection('tracks')

        return Promise.all(tracks.map(trackData => {
            const event: Track = {
                accentColor: trackData.accent_color,
                iconUrl: trackData.icon_url,
                id: trackData.id,
                name: trackData.name,
                textColor: trackData.text_color
            }

            return tracksCollection.doc(event.id).set(event)
        }))
    }).then(() => {
        response.status(200).send('Yay!')
    }).catch(error => {
        console.error(error)
        response.status(500).send('Nay.')
    })
}