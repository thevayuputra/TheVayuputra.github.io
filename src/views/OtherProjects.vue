<template>
  <div>
    <h1>Other Projects</h1>

    <div style="margin-bottom: 30px;">
      Here are some web and mobile apps our team has created or contributed to.
    </div>

    <ProjectsList :projects="projects" />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import ProjectsList from "@/components/ProjectsList.vue";
import ProjectData from "@/data/ProjectData";

export default defineComponent({
  name: "OtherProjects",
  components: {
    ProjectsList,
  },
  data: function () {
     return {
      projects: [] as Array<{ id: string; baseUrl:string; name: string; iconUrl: string; width: number; height: number; accentColor: string; shortDescription?: string; fullDescription?: string; links?: Array<{name: string; url: string}>; videos?: string[]; images?: string[]; preloadImages?: string[] }>,
    };
  },
  created: async function () {
    const response = await fetch(`${import.meta.env.BASE_URL}projectList.json`);
    const projectList = await response.json();
    const projectPromises = projectList.otherProjects.map(async (projectInfo: { id: string; baseUrl?: string; override?: Partial<ProjectData> }) => {
      // Use the project-specific baseUrl if provided, otherwise use the global one
      const baseUrl = projectInfo.baseUrl || projectList.baseUrl;
      const projectResponse = await fetch(`${baseUrl}${projectInfo.id}/data.json`);
      const projectData = await projectResponse.json();
      // Apply the base URL
      projectData.baseUrl = `${baseUrl}${projectInfo.id}/`;
      // Apply any override values
      if (projectInfo.override) {
        Object.assign(projectData, projectInfo.override);
      }
      return projectData;
    });
    this.projects = await Promise.all(projectPromises);
  },
});
</script>
