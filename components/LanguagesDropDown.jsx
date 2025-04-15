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

const LanguagesDropDown = ({ml,mt}) => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const languages = [
    { label: t("english"), value: "en" },
    { label: t("russian"), value: "ru" },
    { label: t("azerbaijani"), value: "az" },
    { label: t("german"), value: "de" },
  ];

  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const currentLang = languages.find(lang => lang.value === i18n.language);
    if (currentLang) {
      setSelectedLabel(currentLang.label);
    }
  }, [i18n.language, t]);

  const toggleExpanded = () => setExpanded(prev => !prev);

  const onSelect = (item) => {
    changeLanguage(item.value);
    setSelectedLabel(item.label);
    setExpanded(false);
  };

  return (
    <View style={{ width: 160, backgroundColor: "black", paddingHorizontal: 20 }}>
      <TouchableOpacity
        onPress={toggleExpanded}
        style={{
          height: 30,
          backgroundColor: "#fff",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 15,
          borderRadius: 8,
          marginTop: 6,
        }}
      >
        <Text style={{ fontSize: 13, opacity: 0.8 }}>{selectedLabel}</Text>
        <AntDesign name={expanded ? "caretup" : "caretdown"} />
      </TouchableOpacity>

      {expanded && (
        <Modal visible={expanded} transparent>
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: "start",
                alignItems: "center",
                marginTop:5
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: 120,
                  padding: 10,
                  borderRadius: 6,
                  maxHeight: 250,
                  marginTop:mt,
                  marginLeft:ml
                }}
              >
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ height: 45, justifyContent: "center" }}
                      onPress={() => onSelect(item)}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={<View style={{ height: 10 }} />}
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
