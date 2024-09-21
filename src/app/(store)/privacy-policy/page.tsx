import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">POLITICA SULLA PRIVACY</CardTitle>
        <CardDescription>
          <p className="text-sm text-muted-foreground">
            Questa politica è in vigore dal 20 settembre 2024 23:45.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          La tua privacy è importante per noi. È politica di iFast Store rispettare la tua privacy in relazione a qualsiasi
          informazione che possiamo raccogliere sul sito iFast Store e altri siti che possediamo e gestiamo.
        </p>
        <p>
          Richiediamo informazioni personali solo quando ne abbiamo effettivamente bisogno per fornirti un servizio. Lo facciamo
          con mezzi equi e legali, con la tua conoscenza e il tuo consenso. Ti informiamo anche sul motivo per cui stiamo
          raccogliendo e come verrà utilizzato.
        </p>
        <p>
          Conserviamo le informazioni raccolte solo per il tempo necessario a fornire il servizio richiesto. Quando memorizziamo
          i dati, li proteggiamo con mezzi commercialmente accettabili per prevenire perdite e furti, nonché accessi,
          divulgazioni, copie, usi o modifiche non autorizzati.
        </p>
        <p>
          Non condividiamo pubblicamente o con terze parti informazioni di identificazione personale, tranne quando richiesto
          dalla legge.
        </p>
        <p>
          Il nostro sito web potrebbe contenere collegamenti a siti esterni che non sono gestiti da noi. Ti preghiamo di essere
          consapevole che non abbiamo controllo sul contenuto e sulle pratiche di questi siti e non possiamo accettare
          responsabilità per le loro rispettive politiche sulla privacy.
        </p>
        <p>
          Sei libero di rifiutare la nostra richiesta di informazioni personali, comprendendo che potremmo non essere in grado
          di fornirti alcuni dei servizi desiderati.
        </p>
        <p>
          L&#39;uso continuato del nostro sito sarà considerato come accettazione delle nostre pratiche relative alla privacy e alle
          informazioni personali. Se hai domande su come gestiamo i dati degli utenti e le informazioni personali, contattaci.
        </p>
        <p>
          Il servizio Google AdSense che utilizziamo per la pubblicità usa un cookie DoubleClick per fornire annunci più
          pertinenti sul Web e limitare il numero di volte in cui un determinato annuncio viene mostrato.
        </p>
        <p>
          Per ulteriori informazioni su Google AdSense, consulta le FAQ ufficiali sulla privacy di Google AdSense.
        </p>
        <p>
          Utilizziamo gli annunci per compensare i costi di gestione di questo sito e fornire finanziamenti per futuri sviluppi.
          I cookie pubblicitari comportamentali utilizzati da questo sito sono progettati per garantire che tu riceva gli
          annunci più pertinenti possibili, tracciando in modo anonimo i tuoi interessi e presentando cose simili che potrebbero
          interessarti.
        </p>
        <p>
          Diversi partner pubblicizzano per nostro conto e i cookie di tracciamento degli affiliati ci permettono semplicemente
          di vedere se i nostri clienti hanno visitato il sito attraverso uno dei siti dei nostri partner, in modo da poterli
          accreditare adeguatamente e, ove applicabile, consentire ai nostri partner affiliati di offrire eventuali promozioni
          che possono fornirti per effettuare un acquisto.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Impegno dell&#39;Utente</h2>
        <p>
          L&#39;utente si impegna a fare un uso adeguato dei contenuti e delle informazioni che iFast Store offre sul sito e con
          carattere enunciativo, ma non limitativo:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            A) Non impegnarsi in attività che siano illegali o contrarie alla buona fede e all&#39;ordine pubblico;
          </li>
          <li>
            B) Non diffondere propaganda o contenuti di natura razzista, xenofoba, bbebbet o gioco d&#39;azzardo, qualsiasi tipo di
            pornografia illegale, di apologia del terrorismo o contro i diritti umani;
          </li>
          <li>
            C) Non causare danni ai sistemi fisici (hardware) e logici (software) di iFast Store, dei suoi fornitori o di terzi,
            per introdurre o diffondere virus informatici o qualsiasi altro sistema hardware o software che sia in grado di
            causare i danni precedentemente menzionati.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Ulteriori informazioni</h2>
        <p>
          Ci auguriamo che questo sia chiaro e, come menzionato in precedenza, se c&#39;è qualcosa che non sei sicuro di avere
          bisogno o meno, di solito è più sicuro lasciare i cookie attivati nel caso in cui interagisca con una delle
          funzionalità che usi sul nostro sito.
        </p>
      </CardContent>
    </Card>
  )
}
