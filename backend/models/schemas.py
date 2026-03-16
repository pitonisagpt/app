import re
from pydantic import BaseModel, field_validator
from typing import List, Optional

# ── Whitelist of valid spread IDs ────────────────────────────────────────────
VALID_SPREAD_IDS = {
    "1-carta", "2-cartas", "si-o-no", "si-no-2", "favor-y-contra",
    "encrucijada", "verdad-oculta", "amor", "que-siente", "encontrar-amor",
    "verdadero-yo", "espejo-alma", "mente-cuerpo-espiritu", "3-cartas",
    "oraculo", "celta", "lunar", "estrella", "gitano", "matriz-destino",
    "sanacion-emocional", "desarrollo-espiritual", "cabala", "dinero",
}

# ── Prompt injection / misuse patterns ───────────────────────────────────────
_INJECTION_RE = re.compile(
    r"""(
        ignore[\s_-]*previous | ignora[\s_-]*las | olvida[\s_-]*(que|tus|las) |
        forget[\s_-]*(you|your|instructions) |
        system[\s_-]*prompt | prompt[\s_-]*del[\s_-]*sistema |
        instrucciones[\s_-]*del[\s_-]*sistema |
        act[\s_-]*as | actúa[\s_-]*como | actua[\s_-]*como |
        pretend[\s_-]*(you|to) | finge[\s_-]*que |
        you[\s_-]*are[\s_-]*now | ahora[\s_-]*eres |
        jailbreak | DAN[\s:,] | do[\s_-]*anything[\s_-]*now |
        bypass | override[\s_-]*(your|the|all) |
        new[\s_-]*instructions | nuevas[\s_-]*instrucciones |
        reveal[\s_-]*(your|the)[\s_-]*(prompt|instructions) |
        muestra[\s_-]*(tu|el)[\s_-]*(prompt|instrucciones) |
        <script | javascript: | data:text |
        \{\{ | \}\} | \{% | %\} | <\?php |
        http[s]?:// | www\.
    )""",
    re.IGNORECASE | re.VERBOSE,
)

# ── Schemas ──────────────────────────────────────────────────────────────────

class DrawnCard(BaseModel):
    name:     str
    symbol:   str
    position: str
    reversed: bool

    @field_validator("name", "symbol", "position")
    @classmethod
    def field_max_length(cls, v: str) -> str:
        if len(v) > 120:
            raise ValueError("Field value too long")
        return v.strip()


class ReadingRequest(BaseModel):
    spread_id: str
    question:  Optional[str] = None
    cards:     List[DrawnCard]

    @field_validator("spread_id")
    @classmethod
    def spread_must_be_valid(cls, v: str) -> str:
        if v not in VALID_SPREAD_IDS:
            raise ValueError(f"Invalid spread_id: '{v}'")
        return v

    @field_validator("question")
    @classmethod
    def question_must_be_safe(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if len(v) > 300:
            raise ValueError("Question exceeds 300 characters")
        if _INJECTION_RE.search(v):
            raise ValueError("Question contains disallowed content")
        return v

    @field_validator("cards")
    @classmethod
    def cards_count_reasonable(cls, v: List[DrawnCard]) -> List[DrawnCard]:
        if len(v) < 1:
            raise ValueError("At least one card is required")
        if len(v) > 10:
            raise ValueError("Too many cards")
        return v
