<template lang='pug'>
link(rel="stylesheet" href="/pages/admin/pages/style.min.css")
script(src="https://unpkg.com/vue")
script(src="/pages/admin/pages/controller.js")
script var data = !{JSON.stringify(data)};

#pages.view.container
  .pages-wrap.row
    h1.col-xs-12 Pages
  .elements-wrap.row
    h2.col-xs-12(v-if='elements.length == 0') Sélectionnez une page pour afficher les éléments
    h2.col-xs-12(v-if='elements.length > 0') Eléments de la page
    .element.col-xs-4(v-for='element in elements')
      h3 {{element.name}}
      .input-wrap(v-for='input in element' v-if='input !== null && typeof input === "object"' v-on:click='test(element)')
        h4 {{input.name}}
        input(v-model='input.value' :type='input.input')
      .validate(v-on:click='validate')
        | Enregistrer
</template>
