"use client";

import { Box, SimpleGrid, Heading, Stat, Text, Icon } from "@chakra-ui/react";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { sensorType } from "@/types/main.types";
import { useLatestMetrics } from "@/hooks/useLatestMetrics";
import { useHistoryMetrics } from "@/hooks/useHistoryMetrics";
import { useState } from "react";
import SensorTypeSelector from "./SensorTypeSelector";

const type = {
  temp: "Temperatura",
  soilHum: "Humedad del suelo",
  airHum: "Humedad del aire",
  waterLevel: "Nivel de agua",
};

export function DashboardContainer() {
  const [sensorType, setSensorType] = useState<sensorType>("temp");

  const latest = useLatestMetrics("ESP32-INV-01", [
    "soilHum",
    "temp",
    "airHum",
    "waterLevel",
  ]);

  const history = useHistoryMetrics("ESP32-INV-01", sensorType);

  return (
    <Box p={6} maxWidth="100vw" mx="auto" bg="black">
      <Heading size="lg" mb={6} color="white">
        Panel de Monitoreo ESP32
      </Heading>

      <Text w="100%" textAlign="right">
        Ultima actualizacion: {new Date(latest.metrics[0]?.date).toTimeString()}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6} mt={4} mb={8}>
        {latest.metrics.map((card, i) => (
          <Box
            key={i}
            p={5}
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="xl"
            shadow="md"
          >
            <Stat.Root>
              <Stat.Label color="gray.400" fontSize="sm">
                {type[card.sensorType]}
              </Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold">
                {card.value.toFixed(2)} {card.sensorType == "temp" ? "°C" : "%"}
              </Stat.ValueText>
              <Stat.HelpText color="gray.400" fontSize="xs" mb={0}>
                ESP32-INV-01
              </Stat.HelpText>
            </Stat.Root>
          </Box>
        ))}
      </SimpleGrid>
      <SensorTypeSelector setType={setSensorType} />
      <SimpleGrid columns={{ base: 1 }} gap={6}>
        <Box
          p={6}
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="xl"
          shadow="md"
        >
          <Heading size="md" mb={6} color="gray.300">
            Historial de {type[sensorType]}
          </Heading>

          <Box height="300px">
            <HumidityChart data={history.history} />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
