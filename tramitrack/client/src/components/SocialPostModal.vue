<template>
  <v-dialog v-model="isOpen" :max-width="maxWidth">
    <template #activator="{ props: activatorProps }">
      <div
        role="button"
        tabindex="0"
        class="social-trigger d-flex align-center ga-3 mb-3"
        v-bind="activatorProps"
      >
        <div class="social-icon-wrap" :style="{ background: iconBackground }">
          <v-icon size="18" color="white">{{ icon }}</v-icon>
        </div>

        <span
          class="text-body-2 text-grey-darken-2 social-profile-link"
          aria-hidden="false"
        >
          {{ profileName }}
        </span>
      </div>
    </template>

    <v-card class="rounded-xl">
      <v-card-title
        class="d-flex align-center justify-space-between ga-3 flex-wrap"
      >
        <div class="d-flex align-center ga-2">
          <v-icon :color="iconColor">{{ icon }}</v-icon>
          <span class="font-weight-bold">{{ modalTitle }}</span>
        </div>

        <a
          :href="profileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-body-2 text-primary"
        >
          {{ profileName }}
        </a>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4 pa-sm-6">
        <div
          v-if="platform === 'instagram'"
          class="embed-frame d-flex justify-center"
        >
          <blockquote
            class="instagram-media"
            data-instgrm-captioned
            :data-instgrm-permalink="instagramPermalink"
            data-instgrm-version="14"
            style="
              background: #fff;
              border: 0;
              border-radius: 3px;
              box-shadow:
                0 0 1px 0 rgba(0, 0, 0, 0.5),
                0 1px 10px 0 rgba(0, 0, 0, 0.15);
              margin: 1px;
              max-width: 540px;
              min-width: 326px;
              padding: 0;
              width: calc(100% - 2px);
            "
          >
            <a
              :href="postUrl"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: block;
                padding: 20px;
                text-align: center;
                text-decoration: none;
              "
            >
              Ver esta publicacion en Instagram
            </a>
          </blockquote>
        </div>

        <div v-else class="embed-frame d-flex justify-center">
          <iframe
            :src="facebookEmbedUrl"
            title="Publicacion de Facebook"
            width="500"
            height="683"
            class="facebook-frame"
            scrolling="no"
            frameborder="0"
            allowfullscreen="true"
            allow="
              autoplay;
              clipboard-write;
              encrypted-media;
              picture-in-picture;
              web-share;
            "
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-4 py-3 px-sm-6">
        <v-spacer />
        <v-btn variant="text" @click="isOpen = false">Cerrar</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          :href="postUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en {{ platformLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

interface WindowWithInstagram extends Window {
  instgrm?: {
    Embeds?: {
      process: () => void;
    };
  };
}

type SocialPlatform = "instagram" | "facebook";

const props = withDefaults(
  defineProps<{
    platform: SocialPlatform;
    icon: string;
    profileName: string;
    profileUrl: string;
    postUrl: string;
    iconBackground?: string;
    title?: string;
    maxWidth?: number | string;
    embedUrl?: string;
  }>(),
  {
    iconBackground: "#607d8b",
    maxWidth: 760,
    title: "Publicacion",
    embedUrl: "",
  },
);

const isOpen = ref(false);

const modalTitle = computed(() => props.title);
const platformLabel = computed(() =>
  props.platform === "instagram" ? "Instagram" : "Facebook",
);
const iconColor = computed(() =>
  props.platform === "instagram" ? "pink-darken-1" : "blue-darken-2",
);

const instagramPermalink = computed(() => {
  if (props.postUrl.includes("utm_source=ig_embed")) {
    return props.postUrl;
  }

  const separator = props.postUrl.includes("?") ? "&" : "?";
  return `${props.postUrl}${separator}utm_source=ig_embed&utm_campaign=loading`;
});

const facebookEmbedUrl = computed(() => {
  if (props.embedUrl) {
    return props.embedUrl;
  }

  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(props.postUrl)}&show_text=true&width=500`;
});

async function processInstagramEmbeds() {
  if (props.platform !== "instagram" || typeof window === "undefined") {
    return;
  }

  await nextTick();

  const extendedWindow = window as WindowWithInstagram;
  if (extendedWindow.instgrm?.Embeds?.process) {
    extendedWindow.instgrm.Embeds.process();
    return;
  }

  const scriptId = "instagram-embed-script";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(script);

    await new Promise<void>((resolve) => {
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => resolve(), { once: true });
    });
  }

  extendedWindow.instgrm?.Embeds?.process?.();
}

watch(
  () => isOpen.value,
  async (open) => {
    if (open) {
      await processInstagramEmbeds();
    }
  },
);
</script>

<style scoped>
.social-trigger {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  padding: 2px;
}

.social-trigger:hover {
  background: #f5f5f5;
}

.social-profile-link {
  text-decoration: none;
}

.social-profile-link:hover {
  text-decoration: underline;
}

.social-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.embed-frame {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
}

.facebook-frame {
  width: 100%;
  border: none;
  overflow: hidden;
}

@media (max-width: 600px) {
  .embed-frame {
    max-width: 100%;
  }

  :deep(.instagram-media) {
    min-width: 0 !important;
  }
}
</style>
