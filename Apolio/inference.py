import os
import sys
import time
import torch
import soundfile as sf
import numpy as np

from vc_infer_pipeline import VC
from config import Config
from fairseq import checkpoint_utils
from slicer2 import Slicer
from infer_tool import Svc

# SETTINGS
MODEL_NAME = "Yared-Negu"
WEIGHT_PATH = f"assets/weights/{MODEL_NAME}.pth"
INDEX_PATH = f"logs/{MODEL_NAME}/added_IVF246_Flat_nprobe_1_Yared-Negu_v2.index"
INPUT_AUDIO = "assets/audios/input.wav"
OUTPUT_AUDIO = f"assets/audios/output_{int(time.time())}.wav"

# LOAD CONFIG
config_path = "configs/config.json"
config = Config(config_path)

# INSTANTIATE
print("🔧 Loading model...")
model = Svc(
    net_g_path=WEIGHT_PATH,
    config_path=config_path,
    device="cuda" if torch.cuda.is_available() else "cpu",
    cluster_model_path=INDEX_PATH,
)

# INFERENCE
print("🎙️ Converting audio...")
audio, sr = sf.read(INPUT_AUDIO)
if len(audio.shape) > 1:
    audio = audio.mean(axis=1)  # Convert to mono

sf.write("temp_input.wav", audio, sr)

# Parameters
speaker_id = 0
transpose = 0
auto_f0 = True
cluster_ratio = 0.75

# Run
converted_audio, sample_rate = model.infer(
    "temp_input.wav",
    speaker_id=speaker_id,
    transpose=transpose,
    auto_predict_f0=auto_f0,
    cluster_ratio=cluster_ratio,
    index_path=INDEX_PATH
)

sf.write(OUTPUT_AUDIO, converted_audio, sample_rate)
print(f"✅ Done! Output saved to: {OUTPUT_AUDIO}")
