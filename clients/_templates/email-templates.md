# Notification email templates

Used by the Project Lead to prepare emails for people who are NOT on Trello (or as an extra notice).
- Created as **drafts** in the owner's Outlook with `tools/outlook-draft.ps1` – the owner reviews and clicks **Send**.
  The Project Lead never sends emails itself.
- Recipients come from the client's `PEOPLE.md` (match by name; unknown/ambiguous → ask the owner).
- Language: the client's default language (CLIENT.md / RULES.md). French versions below; translate if needed.
- Signature: name + job title from the client's `POSITION.md`.
- Never include: links to private Trello boards (they can't open them), other people's tasks, agent internals,
  confidential documents not meant for that person. Include the deliverable as links the person CAN open, or ask
  the owner to attach the file.
- Body files are written to the session scratchpad (never in the repo) and passed with `-BodyFile`.
- Subject prefix: `[<Company> – <Project or "Tâche">]`.

---

## 1. Task assigned (to the assignee) – when the owner approves a human task
Subject: `[<Company> – <Project>] Nouvelle tâche : <titre de la tâche>`
```
Bonjour <Prénom>,

Une nouvelle tâche vous est confiée.

Tâche : <titre>
Projet : <projet ou "—">
Objectif : <goal>
Livrable attendu : <deliverable>
Date de début : <start ou "—">        Échéance : <due ou "—">

Critères d'acceptation :
- <critère 1>
- <critère 2>

Relecteurs : <noms ou "—">
Merci de me répondre à cet email avec votre livrable (lien ou pièce jointe) dès qu'il est prêt,
ou pour toute question.

Cordialement,
<Nom> – <Poste>
```

## 2. Review request (to each reviewer) – when the work is finished
Subject: `[<Company> – <Project>] Relecture demandée : <titre>`
```
Bonjour <Prénom>,

Je vous sollicite pour la relecture du livrable suivant.

Tâche : <titre>
Projet : <projet ou "—">
Réalisé par : <nom de la personne ou "notre équipe">
Livrable : <liens>
Échéance de relecture : <date ou "dès que possible">

Critères d'acceptation :
- <critère 1>
- <critère 2>

Merci de répondre à cet email par :
- « ✅ Validé », ou
- « 🔁 Modifications : … » avec vos remarques.

Cordialement,
<Nom> – <Poste>
```

## 3. Changes requested (to the assignee)
Subject: `[<Company> – <Project>] Modifications demandées : <titre>`
```
Bonjour <Prénom>,

Merci pour votre travail sur « <titre> ». Des modifications sont demandées :

<remarques des relecteurs / du responsable, regroupées>

Merci de me renvoyer la nouvelle version<, avant le <date>>.

Cordialement,
<Nom> – <Poste>
```

## 4. Approved (to the assignee, optional cc reviewers)
Subject: `[<Company> – <Project>] Tâche validée : <titre>`
```
Bonjour <Prénom>,

La tâche « <titre> » est validée. Merci pour votre travail !

Cordialement,
<Nom> – <Poste>
```
