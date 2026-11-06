# Générer un AAB localement sous Windows (sans EAS Build)

## Objectif

Créer un **Android App Bundle (`.aab`) signé** à partir de ce projet Expo/React Native sur un PC Windows, puis le charger dans **Google Play Console > Tests internes**.

**Important :** le ZIP contient le **code source**, pas un `.aab` précompilé. Un véritable AAB doit être généré avec le SDK Android et une clé de signature. Il n'est pas nécessaire de créer un compte Expo pour construire avec Gradle en local.

## Étape 0 — Prérequis

- Windows 10/11 + PowerShell.
- **Node.js >= 22.13** (Node.js LTS recommandé) et npm : `node -v`, `npm -v`.
- **JDK 17** installé : `java -version` et `keytool -help`.
- **Android Studio** installé, avec Android SDK **API 36**, Android SDK Build-Tools et Android SDK Command-line Tools.
- Vérifier/initialiser `ANDROID_HOME` (dans une session PowerShell) si nécessaire :

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
```

Si `java` n'est pas reconnu, configurer `JAVA_HOME` vers le répertoire du JDK 17 et ajouter `%JAVA_HOME%\bin` au PATH. Accepter les licences Android SDK via Android Studio.

## Étape 1 — Extraire et installer

Extraire le ZIP dans un dossier séparé, par exemple `C:\dev\PlayStoreHelloWorld`. Éviter de le placer dans le monorepo MBOA FLIX.

```powershell
cd C:\dev\PlayStoreHelloWorld
npm install
```

Ce projet n'utilise **ni pnpm, ni workspace, ni script `sh`**. `npm install` crée automatiquement `package-lock.json`.

## Étape 2 — Adapter le package name

Dans `app.json`, modifier la valeur :

```json
"android": {
  "package": "com.masterclass.helloworldexpo",
  "versionCode": 1
}
```

Remplacer `com.masterclass.helloworldexpo` par **l'identifiant EXACT** associé à l'application dans Google Play Console, si un identifiant y est déjà fixé. L'exemple ci-dessus est prêt à l'emploi seulement pour une **nouvelle application** utilisant ce package ID. Le nom affiché (`expo.name`) n'a pas besoin d'être identique au package ID.

**Faites cette modification AVANT l'étape de prebuild.** Google Play n'accepte pas un AAB dont le package name ne correspond pas à celui de l'application cible. Après un premier téléversement, ne changez plus cet identifiant.

## Étape 3 — Tester dans Expo Go (facultatif)

```powershell
npx expo start --go
```

Ouvrir Expo Go sur le téléphone et scanner le QR code. Ce projet emploie Expo SDK 57, adapté à la version Expo Go disponible pendant la transition vers SDK 58. Un test Expo Go **ne produit pas d'AAB**.

## Étape 4 — Générer le projet Android natif

Depuis la racine :

```powershell
npx expo prebuild --platform android
```

Un dossier `android` apparaît. `expo prebuild` convertit la configuration Expo en projet natif Android/Gradle. Ne pas relancer `prebuild --clean` après modification manuelle de Gradle sans sauvegarder les changements de signature.

## Étape 5 — Créer votre clé de signature privée

Toujours depuis la racine du projet :

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore hello-world-upload-key.keystore -alias hello-world-upload -keyalg RSA -keysize 2048 -validity 10000
Move-Item .\hello-world-upload-key.keystore .\android\app\
```

Choisir un mot de passe solide. Le fichier `.keystore` ainsi créé et ses mots de passe doivent être conservés en lieu sûr. **Ne jamais envoyer cette clé à des étudiants ou la publier sur GitHub.** Pour une mise à jour de la même application Google Play, vous aurez besoin de la même clé d'upload, sauf procédure de réinitialisation Google Play.

**Attention :** si vous aviez déjà publié un AAB pour cette *même* application avec une autre clé d'upload, réutilisez la clé d'upload existante au lieu d'en créer une nouvelle.

## Étape 6 — Définir les propriétés de signature hors du projet

Ouvrir votre fichier Gradle utilisateur :

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.gradle" | Out-Null
notepad "$env:USERPROFILE\.gradle\gradle.properties"
```

Y enregistrer (en remplaçant `MON_MOT_DE_PASSE` par la valeur réelle) :

```properties
MYAPP_UPLOAD_STORE_FILE=hello-world-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=hello-world-upload
MYAPP_UPLOAD_STORE_PASSWORD=MON_MOT_DE_PASSE
MYAPP_UPLOAD_KEY_PASSWORD=MON_MOT_DE_PASSE
```

Ce fichier se trouve en dehors du projet : il ne doit pas être inclus dans le ZIP, ni filmé avec les vrais mots de passe.

## Étape 7 — Modifier `android/app/build.gradle`

Dans la section existante `android { signingConfigs { ... } }`, **ajouter** cette configuration `release` à côté de `debug` :

```groovy
release {
    if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
```

Dans la section existante `android { buildTypes { release { ... } } }`, remplacer la ligne :

```groovy
signingConfig signingConfigs.debug
```

par :

```groovy
signingConfig signingConfigs.release
```

Si le template utilise déjà `signingConfig signingConfigs.release`, ne rien changer. **Ne pas dupliquer les sections `android`, `signingConfigs` ni `buildTypes`.**

## Étape 8 — Compiler le fichier AAB

Depuis la racine du projet :

```powershell
cd android
.\gradlew.bat app:bundleRelease
```

Le premier build peut télécharger Gradle et de nombreuses dépendances Android.

**Résultat attendu :**

```text
BUILD SUCCESSFUL
```

Le fichier créé sera :

```text
C:\dev\PlayStoreHelloWorld\android\app\build\outputs\bundle\release\app-release.aab
```

## Étape 9 — Google Play Console

Ouvrir l'application concernée, puis **Test and release > Testing > Internal testing > Create new release** et ajouter le fichier `app-release.aab`. Compléter les informations et déclarations demandées par Play Console. Utiliser une piste de test pour cette application de démonstration plutôt qu'une mise en production publique ; une app « Hello World » trop minimale peut ne pas satisfaire la politique de fonctionnalité minimale pour une distribution publique.

Google Play exige désormais un ciblage d'**Android 16, API 36** ou plus pour les nouvelles apps mobiles (hors exceptions par type d'appareil). Expo SDK 57 cible API 36 par défaut.

## Erreurs courantes

- `JAVA_HOME is not set` : installer/configurer JDK 17.
- `SDK location not found` : vérifier Android SDK et `ANDROID_HOME` ; on peut créer `android/local.properties` avec `sdk.dir=C:\\Users\\<user>\\AppData\\Local\\Android\\Sdk` (chemin adapté à votre poste).
- `Keystore was tampered with` / `password incorrect` : vérifier les mots de passe et la clé.
- `No matching variant` / erreurs Gradle : copier la première erreur du terminal, pas uniquement les dix dernières lignes.
- `Package name mismatch` : contrôler `android.package` avant `prebuild` ; si déjà précompilé, synchroniser proprement le projet natif et la signature avant un nouveau build.
- `expo: command not found` : installer d'abord avec `npm install`, puis utiliser `npx expo ...`.

## Alternative (compilation dans le cloud)

Si le PC ne possède pas Android Studio/JDK :

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile production
```

Cette alternative produit aussi un `.aab`, mais sur les serveurs EAS, et non sur votre ordinateur. Pour une application déjà téléversée, la clé d'upload utilisée doit correspondre à celle enregistrée sur Google Play.

## Sources officielles

- https://docs.expo.dev/guides/local-app-production/
- https://docs.expo.dev/get-started/create-a-project/
- https://support.google.com/googleplay/android-developer/answer/11926878
