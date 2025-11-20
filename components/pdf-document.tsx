"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { MedicalFormData } from "@/lib/validation"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e40af",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e40af",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 5,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.5,
  },
  empty: {
    fontSize: 10,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
})

interface PDFDocumentProps {
  data: MedicalFormData
}

const renderField = (label: string, value: string | undefined) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={value ? styles.value : styles.empty}>
      {value || "не указано"}
    </Text>
  </View>
)

const PDFDocument = ({ data }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Медицинская анкета пациента</Text>

      {/* Личные данные */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Личные данные</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            {renderField("Ф.И.О", data.fullName)}
          </View>
          <View style={styles.column}>
            {renderField("Паспорт", data.passport)}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            {renderField("Дата рождения", data.birthDate)}
          </View>
          <View style={styles.column}>
            {renderField("Пол", data.gender)}
          </View>
        </View>
        {renderField("Семейное положение", data.maritalStatus)}
        {renderField("Образование", data.education)}
        {renderField("Место работы, специальность, должность", data.job)}
        {renderField("Домашний адрес и телефон", data.address)}
      </View>

      {/* Обращение в клинику */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Обращение в клинику</Text>
        {renderField("Дата поступления", data.admissionDate)}
        {renderField("Диагноз направившего учреждения", data.referralDiagnosis)}
        {renderField("Основные жалобы", data.mainComplaints)}
        {renderField("Детализация основных жалоб", data.mainComplaintsDetail)}
        {renderField("Общие жалобы", data.generalComplaints)}
        {renderField("Дополнительные жалобы", data.additionalComplaints)}
        {renderField("Когда впервые появились жалобы", data.firstSymptomsDate)}
        {renderField("Какие жалобы появились первыми", data.firstSymptoms)}
        {renderField("Что способствовало появлению симптомов", data.triggers)}
        {renderField("Динамика симптомов", data.symptomsDynamic)}
        {renderField("Предыдущие диагнозы и лечение", data.previousDiagnosis)}
        {renderField("Клинические проявления в момент обращения", data.currentState)}
      </View>

      {/* Анамнез жизни */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Анамнез жизни</Text>
        {renderField("Хронические интоксикации", data.badHabits)}
        {renderField("Наследственный анамнез", data.familyHistory)}
        {renderField("Аллергологический анамнез", data.allergies)}
        {renderField("Перенесённые заболевания / операции / прививки", data.pastDiseases)}
      </View>

      {/* Объективное обследование */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Объективное обследование (заполняется врачом)</Text>
        {renderField("Общий осмотр", data.generalExamination)}
        {renderField("Голова и шея", data.headNeck)}
        {renderField("Кожа и подкожная клетчатка", data.skin)}
        {renderField("Органы дыхания (осмотр)", data.respiratory)}
        {renderField("Сердечно-сосудистая система", data.cardiovascular)}
        {renderField("ЖКТ (живот)", data.abdomen)}
        {renderField("Опорно-двигательная система", data.musculoskeletal)}
        {renderField("Пальпация лимфоузлов", data.lymphNodes)}
        {renderField("Пальпация живота", data.abdomenPalpation)}
        {renderField("Перкуссия", data.percussion)}
        {renderField("Аускультация лёгких", data.lungAuscultation)}
        {renderField("Аускультация сердца", data.heartAuscultation)}
        {renderField("Аускультация живота", data.abdomenAuscultation)}
      </View>
    </Page>
  </Document>
)

export { PDFDocument }
