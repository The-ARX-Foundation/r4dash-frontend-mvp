
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use the provided Mapbox token
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxyeWFudGhlZXhwbG9yZXIiLCJhIjoiY21ieWFhYWg2MWdydTJrbjE3OGFqMzFrdSJ9.Gb8fuyHhKnOpuC_1pjH-cw'
    
    return new Response(
      JSON.stringify({ token: MAPBOX_TOKEN }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
