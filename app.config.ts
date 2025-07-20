export default {
  expo: {
    name: "AsSalah",
    slug: "AsSalah",
    extra: {
      BACKEND_API_URL: "http://192.168.100.145:4000",
      eas: {
        projectId: "aae640e5-15b9-41c4-b5bc-273eb8bf4d50"
      }
    },
    android: {
      googleServicesFile: "./android/app/google-services.json",
    },
    ios: {
      googleServicesFile: "./ios/GoogleService-Info.plist",
    },
  },
};
