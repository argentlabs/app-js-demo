import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { useWallet } from "./wallet";
import { formatEther, transfer, useBalance } from "./token";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Controller, useForm } from "react-hook-form";
import { BigNumber, utils } from "ethers";
import Submit from "./icons/SendBtn.svg";
import { useEffect, useState } from "react";
import { encode } from "starknet";

const Container = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 128px 48px 48px;
  background-color: #161616;
`;

const BigInputWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;

const BigInputBalance = styled.Text`
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #8f8e8c;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const BigInputPrefix = styled.Text`
  font-weight: 700;
  font-size: 56px;
  line-height: 67px;
  color: #ffffff;
  text-align: center;
  margin-right: 12px;
`;

const BigInput = styled.TextInput`
  font-weight: 700;
  font-size: 56px;
  line-height: 67px;
  color: #ffffff;
  text-align: center;
`;

const Input = styled.TextInput`
  font-size: 20px;
  line-height: 26px;
  color: #8f8e8c;
  border-bottom-color: #fff;
  border-bottom-width: 1px;
  width: 100%;
  text-align: center;
  padding: 12px 0;

  margin: 16px 0 0;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
`;

const ButtonWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 42px 0 16px;
`;

export default function Send() {
  const wallet = useWallet();
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    const pid = setTimeout(() => {
      setEditable(true);
    }, 100);
    return () => clearTimeout(pid);
  }, []);
  const { navigate } = useNavigation();
  const { data: balance, mutate } = useBalance(wallet.address);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: "",
      to: "",
    },
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#161616",
        minHeight: "50%",
      }}
    >
      <StatusBar style="light" />
      <Container>
        <Controller
          control={control}
          rules={{
            required: true,
            // regex only numbers and . or , as decimal separator
            pattern: /^[0-9]+([.,][0-9]*)?$/,
            validate: (value) => {
              try {
                const amount = utils.parseEther(value.replace(",", "."));

                // smaller or equal to balance
                if (balance && amount.lte(balance)) {
                  return true;
                }

                return false;
              } catch (e) {
                return false;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <BigInputWrapper>
                <BigInputPrefix>Ξ</BigInputPrefix>
                <BigInput
                  placeholderTextColor="#fff"
                  placeholder={"0"}
                  autoFocus
                  onBlur={() => {
                    onBlur();
                  }}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
              </BigInputWrapper>
              <BigInputBalance>
                {formatEther(balance ?? "0")} ETH available
              </BigInputBalance>
            </>
          )}
          name="amount"
        />
        {errors.amount?.type === "required" && (
          <ErrorText>Amount is required</ErrorText>
        )}
        {errors.amount?.type === "pattern" && (
          <ErrorText>Amount needs to be a number</ErrorText>
        )}
        {errors.amount?.type === "validate" && (
          <ErrorText>Not enough funds</ErrorText>
        )}

        <Controller
          control={control}
          rules={{
            minLength: 64,
            maxLength: 66,
            required: true,
            pattern: /^0x[0-9a-fA-F]+$/,
            validate: (value) => {
              try {
                BigNumber.from(value);
                return true;
              } catch (e) {
                return false;
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Address"
              placeholderTextColor="#8F8E8C"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={editable}
            />
          )}
          name="to"
        />
        {errors.amount?.type === "required" ? (
          <ErrorText>Address is required</ErrorText>
        ) : (
          errors.to && (
            <ErrorText>Address needs to be a valid Starknet address</ErrorText>
          )
        )}

        <ButtonWrapper>
          {isSubmitting && (
            <ErrorText>Please wait, it is submitting ...</ErrorText>
          )}
          <Submit
            onPress={handleSubmit(async (data) => {
              if (!wallet.account) {
                return;
              }
              const amount = encode.addHexPrefix(
                utils.parseEther(data.amount.replace(",", ".")).toHexString()
              );
              const to = data.to;
              console.log(await transfer(wallet.account, to, amount));
              await mutate();
              navigate("Home" as any);
            })}
          />
        </ButtonWrapper>
      </Container>
    </SafeAreaView>
  );
}
