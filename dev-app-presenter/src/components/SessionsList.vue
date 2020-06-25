<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selectedSession"
            :items="sessions"
            item-text="session_name"
            item-value="session_id"
            label="Outlined style"
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
    {{ selectedSession }}
  </v-app>
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
      sessions: [],
      selectedSession: null
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
