import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";
import { useTheme } from "@/theme/ThemeContext";

const LanguagesDropDown = ({ ml = 0, mt = 0 }) => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const languages = [
    { label: t("english"), value: "en" },
    { label: t("russian"), value: "ru" },
    { label: t("azerbaijani"), value: "az" },
    { label: t("german"), value: "de" },
  ];

  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const currentLang = languages.find((lang) => lang.value === i18n.language);
    if (currentLang) {
      setSelectedLabel(currentLang.label);
    }
  }, [i18n.language, t]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const onSelect = (item) => {
    changeLanguage(item.value);
    setSelectedLabel(item.label);
    setExpanded(false);
  };

  const backgroundColor = isDark ? "#333" : "#fff";
  const textColor = isDark ? "#fff" : "#111";
  const dropdownBackground = isDark ? "#444" : "#fff";
  const borderColor = isDark ? "#444" : "#ddd";

  return (
    <View style={{ width: 160, paddingHorizontal: 20 }}>
      <TouchableOpacity
        onPress={toggleExpanded}
        style={{
          height: 35,
          backgroundColor: backgroundColor,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 15,
          borderRadius: 8,
          marginTop: 1,
          borderWidth: 1,
          borderColor: borderColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 13, color: textColor }}>{selectedLabel}</Text>
        <AntDesign
          color={textColor}
          name={expanded ? "caretup" : "caretdown"}
        />
      </TouchableOpacity>

      {expanded && (
        <Modal visible={expanded} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop:5
              }}
            >
              <View
                style={{
                  backgroundColor: dropdownBackground,
                  width: 120,
                  padding: 12,
                  borderRadius: 8,
                  maxHeight: 250,
                  marginTop: mt,
                  marginLeft: ml,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 10,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        height: 45,
                        justifyContent: "center",
                        paddingHorizontal: 10,
                      }}
                      onPress={() => onSelect(item)}
                    >
                      <Text style={{ color: textColor, fontSize: 13 }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={<View style={{ height: 8 }} />}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default LanguagesDropDown;
