### Comment utiliser ce modèle :

1. Utilisation du modèle  
  
   #### HTML
     * Commencez avec `index.html`, ce sera votre page racine (la page principale)  
       Des questions sur son contenu ? Référez-vous à `template.html`  
     * Pour créer de nouvelles pages HTML, dupliquez `template.html` dans le dossier et renommez-le selon le chemin URL souhaité.  
       ```
       about.html => my_website.com/about
       ```  
       *Il est recommandé de supprimer les commentaires explicatifs dans toutes les nouvelles pages HTML*

   #### CSS
     * Commencez avec `main.css` dans le dossier `css`
     * À quoi servent `normalize.css` et `html5-boilerplate.css` ?  
       Ils rendent les styles de base cohérents sur tous les types de navigateurs web

   #### JavaScript
     * Commencez avec `main.js` dans le dossier `js`
     * Qu'est-ce que jQuery ? C'est une bibliothèque JavaScript qui vous permet de manipuler votre site web beaucoup plus facilement avec JavaScript
     * Si vous téléchargez des plugins jQuery, collez une version minifiée de ceux-ci dans `plugins.js`

   #### Images
     * Si vous souhaitez héberger vos propres images, placez le fichier image (.jpg, .png, .gif) dans le répertoire images.  
       Ensuite, la source sur une **balise img** sera  
       ```
       <img src="/images/votre_image.jpg">
       ```
2. Si vous souhaitez utiliser un backend, un projet express est initialise dans le dossier back.
Merci de ne pas toucher a la structure meme si vous n'utilisez pas le backend.
### Pour tester votre site:

afin de s'assurer que votre site se deploiera correctement, vous pouvez executer le script test.sh
```
bash test.sh
```
vous aurez besoin de docker installé sur votre machine
