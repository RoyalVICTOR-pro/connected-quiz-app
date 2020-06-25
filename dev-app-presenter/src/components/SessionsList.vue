<template>
  <div>
    <h2>{{ title }}</h2>
    <hr />
    <ul>
      <li v-for="session in sessions">{{ session.session_name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "sessions-list",
  props: ["data"],
  data: function() {
    return {
      title: "Liste des sessions",
      sessionsListURL: "http://localhost:8080/api/v1/sessions/list",
      sessions: []
    };
  },
  created: function() {
    console.log("created");
    axios
      .get(this.sessionsListURL)
      .then(response => {
        this.sessions = response.data.result;
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  }
};
</script>
