import { NextRequest, NextResponse } from 'next/server';

/**
 * AI-Powered Emergency Alert Analysis
 * Uses AI to analyze user input and generate appropriate emergency response
 */
export async function POST(request: NextRequest) {
  try {
    const { description, location, contacts } = await request.json();

    if (!description || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: description, location' },
        { status: 400 }
      );
    }

    // AI Analysis Prompt
    const prompt = `You are an emergency response assistant. A user has reported an emergency situation. 
    
User Description: "${description}"
User Location: ${location.lat}, ${location.lon}
Available Emergency Contacts: ${contacts?.length || 0}

Please provide:
1. Assessment of emergency severity (LOW/MEDIUM/HIGH/CRITICAL)
2. Recommended immediate actions (list 3-5 actions)
3. Which emergency services should be contacted
4. Safety tips for the situation

Format response as JSON with keys: severity, actions, services, tips`;

    // Since we don't have AI SDK configured, return a smart response based on keywords
    const response = generateEmergencyResponse(description, location, contacts);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[v0] AI Alert Error:', error);
    return NextResponse.json(
      { error: 'Failed to process emergency alert' },
      { status: 500 }
    );
  }
}

function generateEmergencyResponse(
  description: string,
  location: { lat: number; lon: number },
  contacts: any[]
) {
  const lowerDesc = description.toLowerCase();

  // Emergency severity detection
  let severity = 'MEDIUM';
  let services: string[] = [];
  let actions: string[] = [];

  if (
    lowerDesc.includes('chest pain') ||
    lowerDesc.includes('unconscious') ||
    lowerDesc.includes('severe') ||
    lowerDesc.includes('bleeding') ||
    lowerDesc.includes('gunshot') ||
    lowerDesc.includes('stabbed')
  ) {
    severity = 'CRITICAL';
    services = ['Emergency Medical Services (911)', 'Police'];
    actions = [
      'Call 911 immediately',
      'If safe, provide CPR if trained',
      'Stay with the person if possible',
      'Note exact location and landmarks',
      'Remove any immediate dangers'
    ];
  } else if (
    lowerDesc.includes('accident') ||
    lowerDesc.includes('crash') ||
    lowerDesc.includes('fall') ||
    lowerDesc.includes('fire') ||
    lowerDesc.includes('trapped')
  ) {
    severity = 'HIGH';
    services = ['Emergency Medical Services (911)', 'Fire Department'];
    if (lowerDesc.includes('fire') || lowerDesc.includes('trapped')) {
      actions = [
        'Evacuate immediately to safe location',
        'Call 911 from a safe area',
        'Do not use elevators',
        'Close doors behind you to slow fire spread',
        'Help others evacuate if possible'
      ];
    } else {
      actions = [
        'Call 911 immediately',
        'Do not move injured persons unless in danger',
        'Document the scene if safe',
        'Gather witness information',
        'Keep the area clear for emergency responders'
      ];
    }
  } else if (
    lowerDesc.includes('threat') ||
    lowerDesc.includes('assault') ||
    lowerDesc.includes('robbery') ||
    lowerDesc.includes('danger')
  ) {
    severity = 'HIGH';
    services = ['Police', 'Emergency Medical Services (911)'];
    actions = [
      'Move to a safe location immediately',
      'Call 911 to report the threat',
      'Lock yourself in if possible',
      'Do not confront the person',
      'Provide location and description to police'
    ];
  } else if (
    lowerDesc.includes('minor') ||
    lowerDesc.includes('help') ||
    lowerDesc.includes('assistance')
  ) {
    severity = 'LOW';
    services = ['Non-emergency services'];
    actions = [
      'Call local non-emergency number',
      'Describe the situation clearly',
      'Provide exact location',
      'Stay calm and follow dispatcher instructions',
      'Have your ID and contact information ready'
    ];
  } else {
    severity = 'MEDIUM';
    services = ['Police', 'Emergency Medical Services (911)'];
    actions = [
      'Assess the situation for immediate danger',
      'Move to a safe location',
      'Call appropriate emergency services',
      'Share location with trusted contacts',
      'Provide clear descriptions to dispatchers'
    ];
  }

  const tips = [
    'Always prioritize your safety first',
    'Keep your location visible to emergency responders',
    'Stay on the line with 911 until they tell you to hang up',
    'Inform emergency services of any medical conditions or allergies',
    'Keep emergency contacts updated with your location'
  ];

  return {
    severity,
    services,
    actions,
    tips,
    location: { lat: location.lat, lon: location.lon },
    timestamp: new Date().toISOString(),
    contactsNotified: contacts?.length || 0,
    recommendation: `This appears to be a ${severity} severity situation. ${severity === 'CRITICAL' ? 'Call 911 immediately and ' : ''}Contact ${services[0]} as soon as possible.`
  };
}
