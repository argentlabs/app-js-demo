import { StatusBar } from "expo-status-bar";
import { Clipboard, SafeAreaView } from "react-native";
import { useWallet } from "./wallet";
import styled from "styled-components/native";
import QRMock from "./icons/QRMock.svg";
import { FC } from "react";

const Container = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 48px;
  background-color: #161616;
`;

const MyAddressText = styled.Text`
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  text-align: center;
  color: #fff;

  margin: 32px 0 16px;
`;

const AddressText = styled.Text`
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
  color: #8f8e8c;
`;
const Address: FC<{ address?: string }> = ({ address }) => {
  if (!address) {
    return null;
  }

  return (
    <AddressText
      onPress={() => {
        Clipboard.setString(address);
      }}
    >{`${address.substring(0, 2)} ${
      // chunk into groups of 4
      address
        .substring(2)
        .match(/.{1,4}/g)
        ?.join(" ")
    }`}</AddressText>
  );
};

export default function Receive() {
  const wallet = useWallet();

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#161616",
        minHeight: "100%",
      }}
    >
      <StatusBar style="light" />
      <Container>
        <QRMock />
        <MyAddressText>My address</MyAddressText>
        <Address address={wallet.address} />
      </Container>
    </SafeAreaView>
  );
}
