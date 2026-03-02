export default function DataProcessingPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none text-uc-gray-300 leading-relaxed">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
        Data Processing Agreement
      </h1>
      <p className="text-xs text-uc-gray-500 mb-8">
        Last Updated: June 2025
      </p>

      <p>
        This Data Processing Agreement (&quot;DPA&quot;) forms part of the Terms
        of Service between Under Center (&quot;Processor&quot;) and the user or
        institution utilizing the Platform (&quot;Controller&quot;). This DPA
        governs the processing of personal data in connection with Platform
        services.
      </p>

      {/* 1 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        1. Definitions
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white">&quot;Personal Data&quot;</strong>: Any
          information relating to an identified or identifiable natural person
          processed through the Platform, including athlete profiles, valuation
          inputs, and NIL deal parameters.
        </li>
        <li>
          <strong className="text-white">&quot;Processing&quot;</strong>: Any
          operation performed on Personal Data, including collection, storage,
          use, disclosure, and deletion.
        </li>
        <li>
          <strong className="text-white">&quot;Data Subject&quot;</strong>: The
          individual to whom Personal Data relates, including athletes, parents/
          guardians, and institutional representatives.
        </li>
        <li>
          <strong className="text-white">&quot;Sub-Processor&quot;</strong>: Any
          third party engaged by Under Center to process Personal Data on behalf
          of the Controller.
        </li>
      </ul>

      {/* 2 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        2. Scope and Purpose
      </h2>
      <p>
        Under Center processes Personal Data solely for the purpose of
        providing Platform services as described in the Terms of Service. This
        includes generating educational NIL valuations, displaying compliance
        information, facilitating communication between Platform users, and
        producing aggregate analytics. Processing is limited to what is
        necessary and proportionate for these purposes.
      </p>

      {/* 3 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        3. Categories of Data Processed
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-4 text-white font-semibold">
                Category
              </th>
              <th className="text-left py-2 text-white font-semibold">
                Examples
              </th>
            </tr>
          </thead>
          <tbody className="text-uc-gray-400">
            <tr className="border-b border-white/5">
              <td className="py-2 pr-4">Identity Data</td>
              <td className="py-2">
                Name, email, phone, institutional affiliation
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-4">Athletic Data</td>
              <td className="py-2">
                Position, stats, recruiting rankings, eligibility status
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-4">NIL Data</td>
              <td className="py-2">
                Valuation inputs, deal parameters, compensation details
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-4">Usage Data</td>
              <td className="py-2">
                Pages viewed, features used, session duration
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-4">Minor Data</td>
              <td className="py-2">
                Guardian consent records, age verification status
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        4. Processor Obligations
      </h2>
      <p>Under Center shall:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Process Personal Data only on documented instructions from the
          Controller, except where required by applicable law.
        </li>
        <li>
          Ensure that persons authorized to process Personal Data are subject to
          confidentiality obligations.
        </li>
        <li>
          Implement appropriate technical and organizational security measures,
          including encryption, access controls, and regular security
          assessments.
        </li>
        <li>
          Not engage a Sub-Processor without prior written authorization from
          the Controller, and ensure Sub-Processors are bound by equivalent data
          protection obligations.
        </li>
        <li>
          Assist the Controller in responding to Data Subject rights requests.
        </li>
        <li>
          Notify the Controller without undue delay upon becoming aware of a
          Personal Data breach.
        </li>
        <li>
          Delete or return all Personal Data upon termination of services, at the
          Controller&apos;s election, unless retention is required by law.
        </li>
      </ul>

      {/* 5 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        5. Controller Obligations
      </h2>
      <p>The Controller shall:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Ensure that the collection and transfer of Personal Data to Under
          Center is lawful and that all necessary consents have been obtained.
        </li>
        <li>
          Provide clear instructions regarding the processing of Personal Data.
        </li>
        <li>
          Comply with all applicable data protection laws in its jurisdiction,
          including providing required notices to Data Subjects.
        </li>
      </ul>

      {/* 6 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        6. Security Measures
      </h2>
      <p>
        Under Center maintains security measures designed to protect Personal
        Data, including:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Encryption of data in transit (TLS 1.2+) and at rest</li>
        <li>Role-based access controls with least-privilege principles</li>
        <li>Regular vulnerability assessments and penetration testing</li>
        <li>Employee security awareness training</li>
        <li>Incident response and breach notification procedures</li>
        <li>Secure data deletion and disposal processes</li>
      </ul>

      {/* 7 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        7. Data Breach Notification
      </h2>
      <p>
        In the event of a Personal Data breach, Under Center shall notify the
        Controller without undue delay and in any event within 72 hours of
        becoming aware of the breach. The notification shall include: (a) the
        nature of the breach; (b) the categories and approximate number of
        Data Subjects affected; (c) the likely consequences; and (d) measures
        taken or proposed to mitigate the breach.
      </p>

      {/* 8 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        8. Data Retention and Deletion
      </h2>
      <p>
        Personal Data is retained only for as long as necessary to fulfill the
        purposes described in this DPA or as required by applicable law. Upon
        termination of the service relationship or upon the Controller&apos;s
        written request, Under Center shall delete or de-identify all Personal
        Data within 90 days, except where retention is required by law.
      </p>

      {/* 9 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        9. Compliance with Education Privacy Laws
      </h2>
      <p>
        Where the Platform is used by or on behalf of educational institutions,
        Under Center acknowledges its obligations under applicable education
        privacy laws, including FERPA. Under Center shall not use education
        records for any purpose other than providing Platform services and
        shall not disclose education records to third parties without proper
        authorization.
      </p>

      {/* 10 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        10. Audit Rights
      </h2>
      <p>
        The Controller may request reasonable documentation or information
        demonstrating Under Center&apos;s compliance with this DPA. Under
        Center shall make available all information necessary to demonstrate
        compliance, subject to the protection of confidential business
        information and the security of other customers&apos; data.
      </p>

      {/* 11 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        11. Term and Termination
      </h2>
      <p>
        This DPA remains in effect for the duration of the service relationship
        and shall survive termination to the extent necessary to fulfill data
        deletion obligations and any ongoing legal requirements.
      </p>

      {/* 12 */}
      <h2 className="text-lg font-semibold text-white mt-10 mb-3">
        12. Contact
      </h2>
      <p>
        For questions about this Data Processing Agreement, contact us at{" "}
        <span className="text-uc-cyan">privacy@undercenter.com</span>.
      </p>
    </article>
  );
}
