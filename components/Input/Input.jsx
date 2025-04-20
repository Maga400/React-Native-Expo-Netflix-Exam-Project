import { TextInput } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

const Input = ({
  name,
  placeholder,
  value,
  setFormData,
  className,
  style,
  isSecure,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <TextInput
      placeholderTextColor={isDark ? "#FFFFFFB2" : "white"}
      secureTextEntry={
        (name === "password" || name === "repeat_password") && isSecure
          ? true
          : false
      }
      defaultValue={value}
      onChangeText={(text) => {
        setFormData((prevState) => ({
          ...prevState,
          [name]: name === "email" ? text.toLowerCase() : text,
        }));
      }}
      placeholder={placeholder}
      className={className}
      style={style}
    />
  );
};

export default Input;
